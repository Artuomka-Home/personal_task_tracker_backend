import { BadRequestException } from '@nestjs/common';
import validator from 'validator';

export function isStrongPass(password: string): boolean{
    const isStrongPass: boolean = validator.isStrongPassword(password, {
        minLength: 8, 
        minLowercase: 1, 
        minUppercase: 1, 
        minNumbers: 1, 
        minSymbols: 1, 
        returnScore: false, 
        pointsPerUnique: 1, 
        pointsPerRepeat: 0.5, 
        pointsForContainingLower: 10, 
        pointsForContainingUpper: 10, 
        pointsForContainingNumber: 10, 
        pointsForContainingSymbol: 10 
    });
    if (!isStrongPass) {
        throw new BadRequestException('Password is not strong enough');
    }

    return isStrongPass;
}