// src/modules/todos/todos.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseArrayPipe } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto/create-todo.dto';
import { UpdateTodoDto } from './dto/create-todo.dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  store(@Body() body: CreateTodoDto) {
    return this.todosService.store(body);
  }

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.todosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(+id);
  }


  @Patch('/change-status/:id')
  updateCompletedStatus(@Param('id') id: number) {
    return this.todosService.updateCompletedStatus(+id);
  }

  @Delete()
  removeBulk(
    @Query("ids", new ParseArrayPipe({ items: Number, separator: "," }))
		ids: number[],
  ) {
    return this.todosService.removeBulk(ids);
  }
}
