import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/entities/Comments';
import { Repository } from 'typeorm/repository/Repository';
import { writePostCommentDTO } from './dto/service/writePostComments.dto';
import { writeReplyCommentDTO } from './dto/service/writeReplyComment.dto';
@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comments) private commentsRepo: Repository<Comments>) {}

  //////////////////// WriteComments

  // 코멘트 작성
  async writePostComment(writePostCommentDto: writePostCommentDTO): Promise<Comments> {
    try {
      const { userID, postID, contents } = writePostCommentDto;
      return await this.commentsRepo.save({
        usersId: userID,
        postsId: postID,
        htmlContent: contents,
        replyLevel: 0,
        createdAt: 0,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  //  리플 작성
  async writeReplyComment(writeReplyCommentDto: writeReplyCommentDTO) {
    try {
      const { userID, postID, contents, replyLevel, replyTo } = writeReplyCommentDto;
      if (replyLevel != 0) throw new Error('대댓을 작성할 수 없습니다.');
      return await this.commentsRepo.save({
        usersId: userID,
        postsId: postID,
        htmlContent: contents,
        replyTo: replyTo,
        replyLevel: 1,
        createdAt: 0,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  // 포스트의 코멘트만 모두 반환
  async viewPostComments(postID: string) {
    try {
      return await this.commentsRepo.find({
        postsId: postID,
        replyTo: null,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  // 코멘트의 리플만 모두 반환
  async viewReplyComments(rootCommentID: string) {
    try {
      return await this.commentsRepo.find({
        replyTo: rootCommentID,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  // 코멘트를 수정합니다.
  async updateComment(commentID: string, contents: string) {
    try {
      const now = new Date();
      return await this.commentsRepo.save({
        id: commentID,
        htmlContent: contents,
        updateAt: now,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  // 코멘트를 삭제합니다.
  async deleteComment(commentID: string) {
    try {
      return await this.commentsRepo.softRemove({
        id: commentID,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
