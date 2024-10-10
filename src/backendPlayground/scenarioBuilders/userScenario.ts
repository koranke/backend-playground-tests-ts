import { ScenarioCore } from '../../core/utilities/scenarioCore'
import { UserService } from '../api/userService'
import { faker } from '@faker-js/faker'
import { User } from '../entities/userEntity'
import { PostScenario } from './postScenario'
import { Post } from '../entities/postEntity'

export class UserScenario extends ScenarioCore {
    private _numberOfPosts: number | null = null
    private _id: number | null = null
    private _firstName: string | null = null
    private _lastName: string | null = null
    private _email: string | null = null
    private _phone: string | null = null
    private _dateOfBirth: string | null = null
    private _postScenarios: PostScenario[] | null = null

    public withDefaults(): UserScenario {
        if (this.needsDefaultValuesPopulated) {
            this._firstName = this.getNonNull(this._firstName, faker.person.firstName())
            this._lastName = this.getNonNull(this._lastName, faker.person.lastName())
            this._email = this.getNonNull(this._email, faker.internet.email())
            this._numberOfPosts = this.getNonNull(this._numberOfPosts, 0)
            if (this._numberOfPosts! > 0) {
                this._postScenarios = []
                for (let i = 0; i < this.numberOfPosts; i++) {
                    this._postScenarios.push(new PostScenario().withDefaults())
                }
            }
            this.needsDefaultValuesPopulated = false
        }
        return this
    }

    public async create(): Promise<UserScenario> {
        this.withDefaults()
        const user = await UserService.create(this.getAsUser()).call()
        this._id = user.id!

        if (this._postScenarios !== null) {
            for (const postScenario of this._postScenarios) {
                postScenario.withUserId(this.id)
                await postScenario.create()
            }
        }
        return this
    }

    public getAsUser(): User {
        return {
            id: this._id!,
            firstName: this._firstName!,
            lastName: this._lastName!,
            email: this._email!,
            phone: this._phone,
            dateOfBirth: this._dateOfBirth
        }
    }

    get numberOfPosts(): number {
        return this._numberOfPosts!
    }

    get id(): number {
        return this._id!
    }

    get firstName(): string {
        return this._firstName!
    }

    get lastName(): string {
        return this._lastName!
    }

    get email(): string {
        return this._email!
    }

    get phone(): string {
        return this._phone!
    }

    get dateOfBirth(): string {
        return this._dateOfBirth!
    }

    get postScenarios(): PostScenario[] {
        return this._postScenarios!
    }

    get posts(): Post[] {
        const posts: Post[] = []
        if (this._postScenarios !== null) {
            for (const postScenario of this._postScenarios) {
                posts.push(postScenario.getAsPost())
            }
        }
        return posts
    }

    public withFirstName(firstName: string | null): UserScenario {
        this._firstName = firstName
        return this
    }

    public withLastName(lastName: string | null): UserScenario {
        this._lastName = lastName
        return this
    }

    public withEmail(email: string | null): UserScenario {
        this._email = email
        return this
    }

    public withPhone(phone: string): UserScenario {
        this._phone = phone
        return this
    }

    public withDateOfBirth(dateOfBirth: string): UserScenario {
        this._dateOfBirth = dateOfBirth
        return this
    }

    public withPost(postScenario: PostScenario): UserScenario {
        if (this._postScenarios === null) {
            this._postScenarios = []
        }
        this._postScenarios.push(postScenario)
        return this
    }

    public withNumberOfPosts(numberOfPosts: number): UserScenario {
        this._numberOfPosts = numberOfPosts
        return this
    }
}