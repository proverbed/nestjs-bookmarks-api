import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookmarkDto } from './dto/bookmark.dto';
import { BookmarkService } from './bookmark.service';
import { EditBookmarkDto } from './dto';

@Controller('bookmarks')
@UseGuards(JwtGuard)
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  getBookmarks(@GetUser() user: User) {
    return this.bookmarkService.getBookmarks(user);
  }

  @Get(':id')
  getBookmarkById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(user, bookmarkId);
  }

  @Post()
  createBookmark(@GetUser() user: User, @Body() bookmarkDto: BookmarkDto) {
    return this.bookmarkService.createBookmark(user, bookmarkDto);
  }

  @Patch(':id')
  editBookmark(
    @GetUser() user: User,
    @Body() bookmarkDto: EditBookmarkDto,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.editBookmarkById(user, bookmarkId, bookmarkDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBookmarkById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(user, bookmarkId);
  }
}
