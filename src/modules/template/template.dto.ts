import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString } from 'class-validator'
import { PagerDto } from '~/common/dto/pager.dto'

export class TemplateTypeQueryDto extends PagerDto {
  @ApiProperty({ description: '模板名称' })
  @IsString()
  @IsOptional()
  name: string

  @ApiProperty({ description: '模板状态' })
  @IsIn([0, 1, 2])
  @IsOptional()
  status: 1

  @ApiProperty({ description: '是否内置' })
  @IsOptional()
  isBuildIn: number
}

export class TemplateTypeWordDto extends PagerDto {
  @ApiProperty({ description: '模板名称' })
  @IsString()
  @IsOptional()
  name: string
}
