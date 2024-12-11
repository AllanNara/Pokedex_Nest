import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, mongo } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private readonly defaultLimit: number

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get('defaultLimit')
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error: mongo.MongoServerError | unknown) {
      this.handleExceptions(error, 'create');
    }
  }

  async findAll({ limit = this.defaultLimit, offset = 0 }: PaginationDto) {
    return await this.pokemonModel.find({})
      .limit(limit)
      .skip(offset)
      .sort({
        no: 'asc'
      })
      .select('-__v')
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    } else if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    } else {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase() });
    }

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name, or no "${term}" not found`,
      );
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    let pokemon = await this.findOne(term);
    if (updatePokemonDto.name)
      pokemon.name = updatePokemonDto.name.toLowerCase();
    if (updatePokemonDto.no) pokemon.no = updatePokemonDto.no;

    try {
      await pokemon.save();
      return pokemon;
    } catch (error) {
      this.handleExceptions(error, 'update');
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();

    // await this.pokemonModel.findByIdAndDelete(id);

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id "${id} not found`);
  }

  private handleExceptions(error: any, verb: 'create' | 'update') {
    if (error instanceof mongo.MongoServerError && error.code === 11000) {
      throw new BadRequestException(
        `Pokemon already exists in the database: ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't ${verb} Pokemon - Check server logs`,
    );
  }
}
