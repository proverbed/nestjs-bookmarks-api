import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { before } from 'node:test';

describe('App (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'Some@email.com',
      password: '13444',
    };
    describe('Sign up', () => {
      it('should throw if no body is provided', (done) => {
        request(app.getHttpServer())
          .post('/auth/signup')
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          });
      });
      it('should throw when email is empty', (done) => {
        request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            password: dto.password,
            email: '',
          })
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          });
      });
      it('should throw when email is empty', (done) => {
        request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            password: dto.password,
          })
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          });
      });

      it('should throw when password is not defined', (done) => {
        request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            email: dto.email,
          })
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          });
      });

      it('should throw when password is empty', (done) => {
        request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            email: dto.email,
            password: '',
          })
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          });
      });
      it('should throw when email is invalid', (done) => {
        request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            email: 'invalid-email',
            password: dto.password,
          })
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          });
      });

      it('should sign up', (done) => {
        request(app.getHttpServer())
          .post('/auth/signup')
          .send(dto)
          .expect('Content-Type', /json/)
          .expect(201)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          });
      });
    });

    describe('Sign in', () => {
      it('should throw if no body is provided', (done) => {
        request(app.getHttpServer())
          .post('/auth/signin')
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          });
      });
      it('should throw when email is empty', (done) => {
        request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            password: dto.password,
            email: '',
          })
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          });
      });
      it('should throw when email is empty', (done) => {
        request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            password: dto.password,
          })
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          });
      });

      it('should throw when password is not defined', (done) => {
        request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            email: dto.email,
          })
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          });
      });

      it('should throw when password is empty', (done) => {
        request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            email: dto.email,
            password: '',
          })
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          });
      });
      it('should throw when email is invalid', (done) => {
        request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            email: 'invalid-email',
            password: dto.password,
          })
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          });
      });
      it('should sign in', (done) => {
        request(app.getHttpServer())
          .post('/auth/signin')
          .send(dto)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          });
      });
    });
  });

  describe('User', () => {
    let userAt: string;
    const dto: AuthDto = {
      email: 'Some1@email.com',
      password: '134441',
    };

    beforeAll(() => {
      console.log('gets here');
      request(app.getHttpServer())
        .post('/auth/signin')
        .send(dto)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          console.log(userAt, res.body);
          userAt = res.body.access_token;
        });
    });

    describe('Get me', () => {
      const headers = {
        Authorization: `Bearer ${userAt}`,
      };
      console.log(headers);
      it('should get current user', (done) => {
        request(app.getHttpServer())
          .get('/users/me')
          .set(headers)
          .expect('Content-Type', /json/)
          .expect(201)
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          });
      });
    });

    describe('Edit user', () => {});
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {});

    describe('Get bookmarks', () => {});

    describe('Get bookmarks by id', () => {});
    describe('Edit bookmark', () => {});
    describe('Delete bookmark', () => {});
  });
});
