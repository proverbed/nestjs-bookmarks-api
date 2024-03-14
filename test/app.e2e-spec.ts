import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { before } from 'node:test';
import { EditUserDto } from 'src/user/dto';

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
    let headers;

    beforeAll((done) => {
      request(app.getHttpServer())
        .post('/auth/signup')
        .send(dto)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (_, res) {
          userAt = res.body.access_token;
          headers = {
            Authorization: `Bearer ${userAt}`,
          };
          done();
        });
    });

    describe('Get me', () => {
      it('should get current user', () => {
        return request(app.getHttpServer())
          .get('/users/me')
          .set(headers)
          .expect('Content-Type', /json/)
          .expect(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          email: 'new@email.com',
          firstName: 'dmitri',
        };

        return request(app.getHttpServer())
          .patch('/users')
          .set(headers)
          .send(dto)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => {
            expect(response.body.email).toEqual(dto.email);
            expect(response.body.firstName).toEqual(dto.firstName);
          });
      });

      const scenarios = [
        {
          description: 'should throw if email is invalid',
          data: {
            email: 'invalid-email',
          },
        },
        {
          description: 'should throw if firstName is not a string',
          data: {
            firstName: 323123,
          },
        },
        {
          description: 'should throw if lastName is not a string',
          data: {
            lastName: 323123,
          },
        },
      ];

      scenarios.forEach((item) => {
        it(item.description, (done) => {
          request(app.getHttpServer())
            .patch('/users')
            .set(headers)
            .send(item.data)
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
              if (err) return done(err);
              return done();
            });
        });
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {});

    describe('Get bookmarks', () => {});

    describe('Get bookmarks by id', () => {});

    describe('Edit bookmark', () => {});
    
    describe('Delete bookmark', () => {});
  });
});
