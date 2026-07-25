import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async myConversations(userId: string) {
    return this.prisma.supportConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        _count: { select: { messages: true } },
      },
    });
  }

  async createConversation(userId: string, subject?: string) {
    return this.prisma.supportConversation.create({
      data: { userId, subject },
      include: { messages: true },
    });
  }

  async getMessages(conversationId: string, userId: string) {
    const conversation = await this.prisma.supportConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== userId) {
      throw new ForbiddenException('مکالمه یافت نشد');
    }

    return this.prisma.supportMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(conversationId: string, userId: string, text: string) {
    const conversation = await this.prisma.supportConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== userId) {
      throw new ForbiddenException('مکالمه یافت نشد');
    }

    const message = await this.prisma.supportMessage.create({
      data: {
        conversationId,
        senderId: userId,
        senderRole: 'user',
        text,
      },
    });

    await this.prisma.supportConversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    return message;
  }
}
