import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { SignIn } from '../domain/signIn'
import { ISignInDbModel } from '../dbModels/iSignInDbModel'

export class SignInMap implements IMapper<SignIn> {
  // public static toDTO(signIn: SignIn): SignInDTO {
  //   return {
  //     _id: signIn.signInMemberId.toString(),
  //     signInMemberId: signIn.signInMemberId,
  //     createAt: signIn.createAt,
  //     reward: signIn.reward
  //   }
  // }

  public static toDomain(raw: ISignInDbModel): SignIn {
    const signInOrError = SignIn.create(
      {
        signInMemberId: raw.signInMemberId,
        createAt: raw.createAt,
        reward: raw.reward
      },
      new UniqueEntityID(raw._id)
    )

    signInOrError.isFailure ? console.log(signInOrError.error) : ''

    return signInOrError.isSuccess ? signInOrError.getValue() : null
  }

  public static async toPersistence(signIn: SignIn): Promise<ISignInDbModel> {
    return {
      _id: signIn.signInId.id.toString(),
      signInMemberId: signIn.signInMemberId,
      createAt: signIn.createAt,
      reward: signIn.reward
    }
  }
}
