import { Module } from '@nestjs/common'
import { InvoiceController } from './invoice.control'
import { InvoiceService } from './invoice.service'

const services = [InvoiceService]

@Module({
  controllers: [InvoiceController],
  providers: [...services],
  exports: [...services],
})
export class InvoiceModule {}
