import { PaginatedResponse } from './paginatedResponse';
import { User } from './user';

export interface PaginatedUserResponse extends PaginatedResponse {
    users: User[]
}

