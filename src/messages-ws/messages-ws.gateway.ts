import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  //INFO: socket decorator for socket io.
  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    //INFO: socket join user to a room name by string, ids, email etc.
    //client.join('room');
    //client.join(client.id);
    //client.join(user.email);

    //INFO: socket emit to all users inside a room
    //this.wss.to('room').emit('')

    //INFO: socket io emit values.
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  //INFO: nest socket io decorator for listening clients emits
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    //INFO: socket emit for a specific client
    //client.emit('message-from-server', {
    //  fullName: '',
    //  message: payload.message || 'no-message!!',
    //});

    //INFO: socket emit to all clients but the sender
    //client.broadcast.emit('message-from-server', {
    //  fullName: '',
    //  message: payload.message || 'no-message!!',
    //});

    //INFO: socket emit to all client in a rom
    //this.wss.to('');

    //INFO: socket emit to all
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!',
    });
  }
}
