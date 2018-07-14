import { Injectable } from '@nestjs/common';
import { Author } from '../interfaces/author.interface';
import { filter, find, identity, pickBy } from 'lodash';

@Injectable()
export class AuthorsService {
    private readonly authors: Author[] = [
        {id: 1, firstName: 'Tom', lastName: 'Coleman'},
        {id: 2, firstName: 'Sashko', lastName: 'Stubailo'},
        {id: 3, firstName: 'Mikhail', lastName: 'Novikov'}
    ];

    findAllBy(args: Author = {} as Author): Author[] {
        return filter(this.authors, pickBy(args, identity))
    }

    findOneBy(args: Author): Author {
        return find(this.authors, pickBy(args, identity))
    }
}