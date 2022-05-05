import config from '../../config/db-config.json';
import {country, tournament, player, income, matches, statistics} from './entities';

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.database, config.user, config.password, {
    dialect: config.dialect,
    host: config.host,
    port: config.port,
    logging: false,
    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
    }
})

const CountryEntity = country(sequelize);
const TournamentEntity = tournament(sequelize);
const PlayerEntity = player(sequelize);
const IncomeEntity = income(sequelize);
const MatchesEntity = matches(sequelize);
const StatisticsEntity = statistics(sequelize);

CountryEntity.hasMany(TournamentEntity);
CountryEntity.hasMany(PlayerEntity);
TournamentEntity.hasMany(IncomeEntity);
PlayerEntity.hasMany(IncomeEntity);
TournamentEntity.hasMany(MatchesEntity);
PlayerEntity.hasMany(MatchesEntity);
MatchesEntity.hasOne(StatisticsEntity);