import { TenantName } from '../domain/tenantName'
import { Tenant } from '../domain/tenant'

export interface ITenantRepo {
  existsSameName(name: string): Promise<boolean>
  getTenantByTenantId(tenantId: string): Promise<Tenant>
  create(tenant: Tenant): Promise<void>
  getAll(): Promise<Tenant[]>
  updateName(_id: string, name: string): Promise<void>
}
