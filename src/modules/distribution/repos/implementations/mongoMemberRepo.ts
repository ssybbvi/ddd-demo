import { IMemberRepo } from '../memberRepo'
import { Member } from '../../domain/member'
import { MemberMap } from '../../mappers/memberMap'
import { MemberId } from '../../domain/memberId'
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID'
import { MemberIdMap } from '../../mappers/memberIdMap'
import { Global } from '../../../../shared/infra/database/mongodb'
import { IMemberDbModel } from '../../dbModels/iMemberDbModel'
import { Collection } from 'mongodb'

export class MemberRepo implements IMemberRepo {
  constructor() {}
  private createCollection(): Collection<IMemberDbModel> {
    return Global.instance.mongoDb.collection<IMemberDbModel>('member')
  }

  public async existsById(_id: string): Promise<boolean> {
    const member = await this.createCollection().findOne({ _id })
    const found = !!member === true
    return found
  }

  public async getById(_id: string): Promise<Member> {
    const member = await this.createCollection().findOne({ _id })
    return MemberMap.toDomain(member)
  }

  public async save(member: Member): Promise<void> {
    const rawSequelizeMember = await MemberMap.toPersistence(member)
    await this.createCollection().insertOne(rawSequelizeMember)
  }

  public async existsByInviteToken(inviteToken: string): Promise<boolean> {
    const member = await this.createCollection().findOne({ inviteToken })
    const found = !!member === true
    return found
  }

  public async getByInviteToken(inviteToken: string): Promise<Member> {
    const member = await this.createCollection().findOne({ inviteToken })
    const found = !!member === true
    if (!found) throw new Error('Member id not found')
    return MemberMap.toDomain(member)
  }
}
