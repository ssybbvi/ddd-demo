import { TenantName } from '../domain/tenantName'
import { Tenant } from '../domain/tenant'

export interface ITenantRepo {
  existsSameName(name: string): Promise<boolean>
  getById(tenantId: string): Promise<Tenant>
  save(tenant: Tenant): Promise<void>
  filter(): Promise<Tenant[]>
}
