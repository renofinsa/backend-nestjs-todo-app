// src/modules/todos/todos.service.ts

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto/create-todo.dto';
import { PrismaService } from 'src/prisma.service';
import { UpdateTodoDto } from './dto/create-todo.dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async store(createTodoDto: CreateTodoDto): Promise<CreateTodoDto> {
    try {
        return await this.prisma.todos.create({
          data: {
            ...CreateTodoDto,
            title: createTodoDto.title,
            description: createTodoDto.description,
            isCompleted: false,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findAll(): Promise<CreateTodoDto[]> {
    try {
      return await this.prisma.todos.findMany({
        where: {
          deletedAt: null
        },
        orderBy: {
          id: 'desc'
        }
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async findOne(id: any): Promise<CreateTodoDto> {
    try {
      const data = await this.prisma.todos.findFirst({
        where: {
          id: id,
          deletedAt: null
        }
      });

      if (!data) {
        throw new ForbiddenException({ message: `Todo with ID ${id} not found`});
      }

      return data;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<UpdateTodoDto> {
    try {
      const data = await this.findOne(id);

      Object.assign(data, {
        ...updateTodoDto,
        updatedAt: new Date()
      });

      return await this.prisma.todos.update({
        where: { id: id },
        data: data
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async remove(id: number): Promise<any> {
    try {
      const data = await this.findOne(id);

      Object.assign(data, {
        updatedAt: new Date(),
        deletedAt: new Date()
      });

      await this.prisma.todos.update({
        where: { id: id },
        data: data
      });

      return {
        message: "Todo has been deleted."
      }
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async updateCompletedStatus(id: number): Promise<any> {
    try {
      const data = await this.findOne(id);

      Object.assign(data, {
        isCompleted: data.isCompleted ? false : true,
        updatedAt: new Date()
      });

      return await this.prisma.todos.update({
        where: { id: id },
        data: data
      });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async removeBulk(ids: number[]): Promise<any> {
    const data = await this.prisma.todos.findMany({
      where: {
        id: {
          in: ids,
        },
        deletedAt: null,
      },
    });
  
    if (data.length === 0) {
      throw new NotFoundException('Todos not found');
    }
  
    await this.prisma.todos.updateMany({
      where: {
        id: {
          in: data.map(item => item.id),
        },
      },
      data: {
        updatedAt: new Date(),
        deletedAt: new Date()
      },
    });

    return {
      message: "Todo has been deleted."
    }
  }
}
