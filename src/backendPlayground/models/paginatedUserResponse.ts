import { PaginatedResponse } from './paginatedResponse'
import { User } from '../entities/userEntity'

export interface PaginatedUserResponse extends PaginatedResponse {
    users: User[]
}

