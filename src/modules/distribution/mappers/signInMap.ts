import { IMapper } from '../../../shared/infra/Mapper'
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID'
import { SignIn } from '../domain/signIn'
import { ISignInDbModel } from '../dbModels/iSignInDbModel'
import { SignInDTO } from '../dtos/signInDTO'

export class SignInMap implements IMapper<SignIn> {
  public static toDTO(signIn: SignIn): SignInDTO {
    return {
      createAt: signIn.createAt,
      reward: signIn.reward,
      superReward: signIn.superReward
    }
  }

  public static toDomain(raw: ISignInDbModel): SignIn {
    const signInOrError = SignIn.create(
      {
        userId: raw.userId,
        createAt: raw.createAt,
        reward: raw.reward,
        superReward: raw.superReward
      },
      new UniqueEntityID(raw._id)
    )

    signInOrError.isFailure ? console.log(signInOrError.error) : ''

    return signInOrError.isSuccess ? signInOrError.getValue() : null
  }

  public static async toPersistence(signIn: SignIn): Promise<ISignInDbModel> {
    return {
      _id: signIn.signInId.id.toString(),
      userId: signIn.userId,
      createAt: signIn.createAt,
      reward: signIn.reward,
      superReward: signIn.superReward
    }
  }
}
