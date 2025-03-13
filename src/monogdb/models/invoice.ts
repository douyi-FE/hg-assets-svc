import mongoose, { Document, Schema } from 'mongoose'

export interface IInvoice extends Document {
  InvoiceApplyId: string
  InvoiceApplyCode: string
  projectName: string
  OrderNo: string
  InvoiceTagNo: string
  OldInvoiceCode: string
  InvoiceCode: string
  BillingDate: string
  BillingDateText: string
  InvoiceAmount: number
  BalanceAmount: number
  BadDebtAmount: number
  RefundAmount: number
  InvoiceStatus: number
  InvoiceStatusName: string
  InvoiceHandleTime: string
  InvoiceTypeName: string
  InvoiceTypeCode: string
  TaxRates: string
  InvoiceContentId: string
  InvoiceContent: string
  OtherInvoiceContent: string
  CustomerName: string
  ContractId: string
  ContractCode: string
  BillingUnitId: string
  BillingUnitName: string
  EmployeeName: string
  ProjectId: string
  ProjectName: string
  ProjectCode: string
  ProjectOrganizationId: string
  ProjectOrganizationName: string
  ProjectManagerName: string
  ProjectManagerCode: string
  Explanation: string
  AccountingSupervisorAuditRemark: string
  TaxManagementAuditRemark: string
  IsImport: number
  DataStatus: number
  ApprovalStatus: number
  ApprovalStatusDescription: string
  CreateBy: string
  CreateAt: string
  UpdateBy: string
  UpdateAt: string
  CreateByName: string
  UpdateByName: string
  InvoiceCategoryId: string
  SerialNumber: string
  InvoiceHandleStatus: number
  IsElectronicInvoice: number
  InvoiceDetails: string
  InvoiceRefundDetailDetailsInfo: string
  InvoiceDetailsHtml: string
  SubmitErrorMessage: string
  InvoiceErrorMessage: string
  InvoiceHandleStatusName: string
  RefundType: string
  AccountingMethodName: string
  InvoiceUpdateAt: string
  IsReApply: string
  FromInvoiceId: string
  ReceivedYear: string
  DisplayMenuIds: string[]
  creator: string
}

const invoiceSchema: Schema = new Schema({
  InvoiceApplyId: { type: String, required: false },
  InvoiceApplyCode: { type: String, required: true },
  projectName: { type: String, required: true },
  OrderNo: { type: String, required: false },
  InvoiceTagNo: { type: String, required: false },
  OldInvoiceCode: { type: String, required: false },
  InvoiceCode: { type: String, required: false },
  BillingDate: { type: String, required: false },
  BillingDateText: { type: String, required: false },
  InvoiceAmount: { type: Number, required: false },
  BalanceAmount: { type: Number, required: false },
  BadDebtAmount: { type: Number, required: false },
  RefundAmount: { type: Number, required: false },
  InvoiceStatus: { type: Number, required: false },
  InvoiceStatusName: { type: String, required: false },
  InvoiceHandleTime: { type: String, required: false },
  InvoiceTypeName: { type: String, required: false },
  InvoiceTypeCode: { type: String, required: false },
  TaxRates: { type: String, required: false },
  InvoiceContentId: { type: String, required: false },
  InvoiceContent: { type: String, required: false },
  OtherInvoiceContent: { type: String, required: false },
  CustomerName: { type: String, required: false },
  ContractId: { type: String, required: false },
  ContractCode: { type: String, required: true },
  BillingUnitId: { type: String, required: false },
  BillingUnitName: { type: String, required: false },
  EmployeeName: { type: String, required: false },
  ProjectId: { type: String, required: false },
  ProjectName: { type: String, required: false },
  ProjectCode: { type: String, required: false },
  ProjectOrganizationId: { type: String, required: false },
  ProjectOrganizationName: { type: String, required: false },
  ProjectManagerName: { type: String, required: false },
  ProjectManagerCode: { type: String, required: false },
  Explanation: { type: String, required: false },
  AccountingSupervisorAuditRemark: { type: String, required: false },
  TaxManagementAuditRemark: { type: String, required: false },
  IsImport: { type: Number, required: false },
  DataStatus: { type: Number, required: false },
  ApprovalStatus: { type: Number, required: false },
  ApprovalStatusDescription: { type: String, required: false },
  CreateBy: { type: String, required: false },
  CreateAt: { type: String, required: false },
  UpdateBy: { type: String, required: false },
  UpdateAt: { type: String, required: false },
  CreateByName: { type: String, required: false },
  UpdateByName: { type: String, required: false },
  InvoiceCategoryId: { type: String, required: false },
  SerialNumber: { type: String, required: false },
  InvoiceHandleStatus: { type: Number, required: false },
  IsElectronicInvoice: { type: Number, required: false },
  InvoiceDetails: { type: String, required: false },
  InvoiceRefundDetailDetailsInfo: { type: String, required: false },
  InvoiceDetailsHtml: { type: String, required: false },
  SubmitErrorMessage: { type: String, required: false },
  InvoiceErrorMessage: { type: String, required: false },
  InvoiceHandleStatusName: { type: String, required: false },
  RefundType: { type: String, required: false },
  AccountingMethodName: { type: String, required: false },
  InvoiceUpdateAt: { type: String, required: false },
  IsReApply: { type: String, required: false },
  FromInvoiceId: { type: String, required: false },
  ReceivedYear: { type: String, required: false },
  DisplayMenuIds: { type: [String], required: false },
  creator: { type: String, required: false },
}, { timestamps: true })

const InvoiceCollect = mongoose.model<IInvoice>('Invoice', invoiceSchema, 'invoice')

export default InvoiceCollect
