import { Model } from 'mongoose';
import { BaseModel } from './base.model';

export abstract class BaseService<T extends BaseModel> {

  protected model: Model<T>;

  async findAll(filter = {}): Promise<T[]> {
    return this.model.find(filter);
  }

  async findOne(filter = {}): Promise<T> {
    return this.model.findOne(filter);
  }

  async findById(id: string): Promise<T> {
    return this.model.findById(id);
  }

  async create(item: T): Promise<T> {
    return this.model.create(item);
  }

  async update(id: string, item: T): Promise<T> {
    return this.model.findByIdAndUpdate(id, item);
  }

  async delete(id: string): Promise<T> {
    return this.model.findByIdAndDelete(id);
  }

  async clearAll() {
    return this.model.remove();
  }
}