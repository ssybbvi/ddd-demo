import { Attribute } from '../domain/attribute'

export interface IAttributeRepo {
  save(attribute: Attribute): Promise<void>
  getById(_id: string): Promise<Attribute>
  exist(_id: string): Promise<boolean>
  filter(): Promise<Attribute[]>
}
