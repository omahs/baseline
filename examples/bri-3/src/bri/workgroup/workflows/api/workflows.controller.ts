import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateWorkflowCommand } from '../capabilities/createWorkflow/createWorkflow.command';
import { DeleteWorkflowCommand } from '../capabilities/deleteWorkflow/deleteWorkflow.command';
import { GetAllWorkflowsQuery } from '../capabilities/getAllWorkflows/getAllWorkflows.query';
import { GetWorkflowByIdQuery } from '../capabilities/getWorkflowById/getWorkflowById.query';
import { UpdateWorkflowCommand } from '../capabilities/updateWorkflow/updateWorkflow.command';
import { CreateWorkflowDto } from './dtos/request/createWorkflow.dto';
import { UpdateWorkflowDto } from './dtos/request/updateWorkflow.dto';
import { WorkflowDto } from './dtos/response/workflow.dto';

@Controller('workflows')
export class WorkflowController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get('/:id')
  async getWorkflowById(@Param('id') id: string): Promise<WorkflowDto> {
    return await this.queryBus.execute(new GetWorkflowByIdQuery(id));
  }

  @Get()
  async getAllWorkflows(): Promise<WorkflowDto[]> {
    return await this.queryBus.execute(new GetAllWorkflowsQuery());
  }

  @Post()
  async createWorkflow(@Body() requestDto: CreateWorkflowDto): Promise<string> {
    return await this.commandBus.execute(
      new CreateWorkflowCommand(
        requestDto.name,
        requestDto.workgroupId,
        requestDto.workstepIds,
      ),
    );
  }

  @Put('/:id')
  async updateWorkflow(
    @Param('id') id: string,
    @Body() requestDto: UpdateWorkflowDto,
  ): Promise<void> {
    return await this.commandBus.execute(
      new UpdateWorkflowCommand(
        id,
        requestDto.name,
        requestDto.workstepIds,
        requestDto.workgroupId,
      ),
    );
  }

  @Delete('/:id')
  async deleteWorkflow(@Param('id') id: string): Promise<void> {
    return await this.commandBus.execute(new DeleteWorkflowCommand(id));
  }
}
