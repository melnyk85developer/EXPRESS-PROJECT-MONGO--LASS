import { inject, injectable } from 'inversify';
import { ErRes } from '../../../../src/shared/utils/ErRes';
import { MongoDBCollection } from '../../../db';
import { DeleteResult, ObjectId } from 'mongodb';

@injectable()
export class ConfirmationRepository {
    constructor(
        @inject(MongoDBCollection) private mongoDB: MongoDBCollection
    ) { }
    async createConfirmationRepository(dto: any): Promise<any> {
        try {
            // console.log('ConfirmationService: - createCo dto: createConfirmationRepository', dto)
            const isCreatedConfirmation = await this.mongoDB.confirmationCollection.insertOne({
                ...dto,
                confirmationCode: dto.confirmationCode,
                expirationDate: dto.expirationDate,
                field: dto.field,
                userId: dto.userId
            })
            // console.log('ConfirmationService: - res isCreatedConfirmation', isCreatedConfirmation)
            return isCreatedConfirmation
        } catch (error) {
            console.error('ConfirmationRepository: - error', error);
            // throw new ErRes(-100, `Ошибка базы данных: createConfirmationRepository: ${error}`, error)
        }
    }
    async updateConfirmationRepository(confirmationId: number, myShopDto: any): Promise<any> {
        const { confirmationCode, isBlocked, field, expirationDate, userId } = myShopDto
        try {
            const updateConfirmation = await this.mongoDB.confirmationCollection.updateOne(
                { confirmationCode, isBlocked, field, expirationDate, userId },
                { where: { id: confirmationId }, returning: true }
            )
            return updateConfirmation
        } catch (error) {
            console.error('ConfirmationRepository: - error', error);
            // throw new ErRes(-100, `Ошибка базы данных: updateConfirmationRepository: ${error}`, error)
        }
    }
    async deleteConfirmationUserIdRepository(userId: number): Promise<DeleteResult | null> {
        try {
            return await this.mongoDB.confirmationCollection.deleteOne({
                where: { userId: userId },
            })
        } catch (error) {
            console.error('ConfirmationRepository: - error', error);
            return null
            // throw new ErRes(-100, `Ошибка базы данных: deleteConfirmationUserIdRepository: ${error}`, error)
        }
    }
    async deleteConfirmationIdRepository(id: number): Promise<DeleteResult | null> {
        try {
            return await this.mongoDB.confirmationCollection.deleteOne({ where: { id: id } })
        } catch (error) {
            console.error('ConfirmationRepository: - error', error);
            return null
            // throw new ErRes(-100, `Ошибка базы данных: deleteConfirmationUserIdRepository: ${error}`, error)
        }
    }
    async findAllConfirmationRepository(): Promise<any> {
        try {
            return await this.mongoDB.confirmationCollection.find()
        } catch (error) {
            // throw new ErRes(-100, `Ошибка базы данных: findAllConfirmationRepository: ${error}`, error)
        }
    }
    async findConfirmationByIdRepository(_id: string): Promise<any | null> {
        // console.log('findConfirmationByIdRepository: - _id', _id);
        try {
            const confirmation = await this.mongoDB.confirmationCollection.findOne({
                _id: new ObjectId(_id), // без where
            });

            // console.log('ConfirmationRepository: - findConfirmationByIdRepository confirmation', confirmation);

            return confirmation ?? null;
        } catch (error) {
            console.error('ConfirmationRepository: - error', error);
            return null;
        }
    }
    async findByUserIdConfirmationRepository(userId: string): Promise<any[] | null> {
        // console.log('findByUserIdConfirmationRepository: - userId', userId);
        try {
            const isConfirmeds = await this.mongoDB.confirmationCollection
                .find({ userId: new ObjectId(userId) })
                .toArray();

            // console.log('ConfirmationRepository: - findByUserIdConfirmationRepository isConfirmeds', isConfirmeds);
            return isConfirmeds
        } catch (error) {
            console.error('ConfirmationRepository: - error', error);
            return null;
        }
    }
    async findByCodeConfirmationRepository(confirmationCode: string): Promise<any> {
        try {
            return await this.mongoDB.confirmationCollection.findOne({ where: { confirmationCode } })
        } catch (error) {
            console.error('ConfirmationRepository: - error', error);
            // throw new ErRes(-100, `Ошибка базы данных: findByCodeConfirmationRepository: ${error}`, error)
        }
    }
}
