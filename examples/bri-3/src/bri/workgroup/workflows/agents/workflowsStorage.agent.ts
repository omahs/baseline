import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { Workstep } from '../../worksteps/models/workstep';
import { WORKFLOW_NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { Workflow } from '../models/workflow';

@Injectable()
export class WorkflowStorageAgent extends PrismaService {
  async getWorkflowById(id: string): Promise<Workflow> {
    const workflowModel = await this.workflow.findUnique({
      where: { id: id },
      include: { worksteps: true },
    });

    if (!workflowModel) {
      throw new NotFoundException(WORKFLOW_NOT_FOUND_ERR_MESSAGE);
    }

    return new Workflow(
      workflowModel.id,
      workflowModel.name,
      workflowModel.worksteps.map((w) => {
        return new Workstep(
          w.id,
          w.name,
          w.version,
          w.status,
          w.workgroupId,
          w.securityPolicy,
          w.privacyPolicy,
        );
      }),
      workflowModel.workgroupId,
    );
  }

  async getAllWorkflows(): Promise<Workflow[]> {
    const workflowModels = await this.workflow.findMany({
      include: { worksteps: true },
    });
    return workflowModels.map((w) => {
      return new Workflow(
        w.id,
        w.name,
        w.worksteps.map((ws) => {
          return new Workstep(
            ws.id,
            ws.name,
            ws.version,
            ws.status,
            ws.workgroupId,
            ws.securityPolicy,
            ws.privacyPolicy,
          );
        }),
        w.workgroupId,
      );
    });
  }

  async getWorkflowsByIds(ids: string[]): Promise<Workflow[]> {
    const workflowModels = await this.workflow.findMany({
      where: {
        id: { in: ids },
      },
      include: { worksteps: true },
    });
    return workflowModels.map((w) => {
      return new Workflow(
        w.id,
        w.name,
        w.worksteps.map((ws) => {
          return new Workstep(
            ws.id,
            ws.name,
            ws.version,
            ws.status,
            ws.workgroupId,
            ws.securityPolicy,
            ws.privacyPolicy,
          );
        }),
        w.workgroupId,
      );
    });
  }

  async createNewWorkflow(workflow: Workflow): Promise<Workflow> {
    const workstepIds = workflow.worksteps.map((w) => {
      return {
        id: w.id,
      };
    });

    const newWorkflowModel = await this.workflow.create({
      data: {
        id: workflow.id,
        name: workflow.name,
        worksteps: {
          connect: workstepIds,
        },
        workgroupId: workflow.workgroupId,
      },
      include: {
        worksteps: true,
      },
    });

    return new Workflow(
      newWorkflowModel.id,
      newWorkflowModel.name,
      newWorkflowModel.worksteps.map((w) => {
        return new Workstep(
          w.id,
          w.name,
          w.version,
          w.version,
          w.workgroupId,
          w.securityPolicy,
          w.privacyPolicy,
        );
      }),
      newWorkflowModel.workgroupId,
    );
  }

  async updateWorkflow(workflow: Workflow): Promise<Workflow> {
    const workstepIds = workflow.worksteps.map((w) => {
      return {
        id: w.id,
      };
    });

    const updatedWorkflowModel = await this.workflow.update({
      where: { id: workflow.id },
      data: {
        name: workflow.name,
        worksteps: {
          set: workstepIds,
        },
        workgroupId: workflow.workgroupId,
      },
      include: {
        worksteps: true,
      },
    });

    return new Workflow(
      updatedWorkflowModel.id,
      updatedWorkflowModel.name,
      updatedWorkflowModel.worksteps.map((ws) => {
        return new Workstep(
          ws.id,
          ws.name,
          ws.version,
          ws.status,
          ws.workgroupId,
          ws.securityPolicy,
          ws.privacyPolicy,
        );
      }),
      updatedWorkflowModel.workgroupId,
    );
  }

  async deleteWorkflow(workflow: Workflow): Promise<void> {
    await this.workflow.delete({
      where: { id: workflow.id },
    });
  }
}
