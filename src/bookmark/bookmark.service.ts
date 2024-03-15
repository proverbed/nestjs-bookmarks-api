import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookmarks(user: User) {
    return this.prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  async getBookmarkById(user: User, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId: user.id,
      },
    });
  }

  async createBookmark(user: User, dto: BookmarkDto) {
    try {
      const bookmark = await this.prisma.bookmark.create({
        data: {
          ...dto,
          userId: user.id,
        },
      });

      return bookmark;
    } catch (error) {
      throw error;
    }
  }

  async editBookmarkById(user: User, bookmarkId: number, dto: EditBookmarkDto) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
      },
    });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== user.id) {
      throw new ForbiddenException('Access to resource denied');
    }

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(user: User, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
      },
    });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== user.id) {
      throw new ForbiddenException('Access to resource denied');
    }

    return this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
