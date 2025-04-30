import type { FastifyRequest } from 'fastify'

import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ThrottlerGuard } from '@nestjs/throttler'
import { ClsModule } from 'nestjs-cls'

import config from '~/config'
import { SharedModule } from '~/shared/shared.module'

import { AllExceptionsFilter } from './common/filters/any-exception.filter'

import { IdempotenceInterceptor } from './common/interceptors/idempotence.interceptor'
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { ApplicationModule } from './modules/application/application.module'
import { ApplicationDataModule } from './modules/application-data/application-data.module'
import { AuthModule } from './modules/auth/auth.module'
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard'
import { RbacGuard } from './modules/auth/guards/rbac.guard'
import { BuildInModule } from './modules/build-in-ejs/builtin.module'
import { DeviceModule } from './modules/device/device.module'
import { EngineerModule } from './modules/engineer/engineer.module'
import { FileStorageModule } from './modules/file-storage/fileStorage.module'
import { FlowApprovalModule } from './modules/flow-approval/flow-approval.module'
import { FlowBindModule } from './modules/flow-bind/flow-bind.module'
import { FlowDesignModule } from './modules/flow-design/flowDesign.module'
import { HealthModule } from './modules/health/health.module'
import { InvoiceModule } from './modules/invoice/invoice.module'
import { LeaveModule } from './modules/leave/leave.module'
import { NetdiskModule } from './modules/netdisk/netdisk.module'
import { OutputValueModule } from './modules/output-value/output-value.module'
import { ProjectModule } from './modules/project/project.module'
import { QuickNavModule } from './modules/quick-nav/quick-nav.module'
import { SseModule } from './modules/sse/sse.module'
import { SystemModule } from './modules/system/system.module'
import { TasksModule } from './modules/tasks/tasks.module'
import { TemplateVersionModule } from './modules/tempalte-version/template-version.module'
import { TemplateModule } from './modules/template/template.module'
import { TemplateAttachModule } from './modules/template-attach/templateAttach.module'
import { TemplateDataModule } from './modules/template-data/templateData.module'
import { TemplateWordModule } from './modules/template-word/template-word.module'
import { TodoModule } from './modules/todo/todo.module'
import { ToolsModule } from './modules/tools/tools.module'
import { UsersModule } from './modules/users-manage/users.module'
import { DatabaseModule } from './shared/database/database.module'
import { SocketModule } from './socket/socket.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      // 指定多个 env 文件时，第一个优先级最高
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      load: [...Object.values(config)],
    }),
    // 启用 CLS 上下文
    ClsModule.forRoot({
      global: true,
      // https://github.com/Papooch/nestjs-cls/issues/92
      interceptor: {
        mount: true,
        setup: (cls, context) => {
          const req = context.switchToHttp().getRequest<FastifyRequest<{ Params: { id?: string } }>>()
          if (req.params?.id && req.body) {
            // 供自定义参数验证器(UniqueConstraint)使用
            cls.set('operateId', Number.parseInt(req.params.id))
          }
        },
      },
    }),
    SharedModule,
    DatabaseModule,

    AuthModule,
    SystemModule,
    TasksModule.forRoot(),
    ToolsModule,
    SocketModule,
    HealthModule,
    SseModule,
    NetdiskModule,

    // biz

    // end biz

    TodoModule,
    // 模板管理module
    TemplateModule,
    // word模板管理module
    TemplateWordModule,
    // 模板数据管理
    TemplateDataModule,
    // 模板附件管理
    TemplateAttachModule,
    // 用户信息管理
    UsersModule,
    // 内置模板管理
    BuildInModule,
    // 模板版本管理
    TemplateVersionModule,
    // 报告生成
    OutputValueModule,
    // 流程设计
    FlowDesignModule,
    // 流程审批
    FlowApprovalModule,
    // 快捷导航管理
    QuickNavModule,
    // 应用管理
    ApplicationModule,
    // 应用数据管理
    ApplicationDataModule,
    // 开票管理
    InvoiceModule,
    // 请假管理
    LeaveModule,
    // 文件存储管理
    FileStorageModule,
    // 项目管理
    ProjectModule,
    // 装置管理
    DeviceModule,
    // 工程管理
    EngineerModule,
    // 流程绑定管理
    FlowBindModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },

    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_INTERCEPTOR, useFactory: () => new TimeoutInterceptor(15 * 1000) },
    { provide: APP_INTERCEPTOR, useClass: IdempotenceInterceptor },

    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RbacGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },

  ],
})
export class AppModule {}
