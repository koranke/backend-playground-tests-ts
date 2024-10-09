import { ScenarioCore } from '../../core/utilities/scenarioCore'
import { UserService } from '../api/userService'
import { fa, faker } from '@faker-js/faker'
import { User } from '../models/user'
// import { PostScenario } from './PostScenario'
// import { Post } from './Post'

export class UserScenario extends ScenarioCore {
    private _numberOfPosts: number | null = null
    private _id: number | null = null
    private _firstName: string | null = null
    private _lastName: string | null = null
    private _email: string | null = null
    private _phone: string | null = null
    private _dateOfBirth: string | null = null
    // private postScenarios: PostScenario[] | null = null

    public withDefaults(): UserScenario {
        if (this.needsDefaultValuesPopulated) {
            this._firstName = this.getNonNull(this._firstName, faker.person.firstName())
            this._lastName = this.getNonNull(this._lastName, faker.person.lastName())
            this._email = this.getNonNull(this._email, faker.internet.email())
            this._numberOfPosts = this.getNonNull(this._numberOfPosts, 0)
            if (this._numberOfPosts! > 0) {
                // this.postScenarios = []
                // for (let i = 0; i < this.numberOfPosts; i++) {
                //     this.postScenarios.push(new PostScenario().withDefaults())
                // }
            }
        }
        return this
    }

    public async create(): Promise<UserScenario> {
        this.withDefaults()
        const user = await UserService.create(this.getAsUser()).call()
        this._id = user.id

        // if (this.postScenarios !== null) {
        //     for (const postScenario of this.postScenarios) {
        //         postScenario.withUserId(this.id)
        //         postScenario.create()
        //     }
        // }
        return this
    }

    public getAsUser(): User {
        const user = new User(
            this._id!,
            this._firstName!,
            this._lastName!,
            this._email!,
            this._phone,
            this._dateOfBirth
        )
        return user
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

    // public withPost(postScenario: PostScenario): UserScenario {
    //     if (this.postScenarios === null) {
    //         this.postScenarios = []
    //     }
    //     this.postScenarios.push(postScenario)
    //     return this
    // }

    public withNumberOfPosts(numberOfPosts: number): UserScenario {
        this._numberOfPosts = numberOfPosts
        return this
    }

    // public getPosts(): Post[] {
    //     const posts: Post[] = []
    //     if (this.postScenarios !== null) {
    //         for (const postScenario of this.postScenarios) {
    //             posts.push(postScenario.getAsPost())
    //         }
    //     }
    //     return posts
    // }
}