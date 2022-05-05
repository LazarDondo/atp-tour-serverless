const { DataTypes, Deferrable } = require('sequelize');

export function country(sequelize) {
    return sequelize.define('Country', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        codeName: {
            type: DataTypes.STRING(3),
            field: "code_name",
            allowNull: false
        }
    });
};

export function tournament(sequelize) {
    return sequelize.define('Tournament', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(30),
            field: 'tournament_name',
            allowNull: false
        },
        hostCountry: {
            type: DataTypes.INTEGER,
            field: 'host_country_id',
            references: {
                model: 'Country',
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            },
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            field: 'start_date',
            allowNull: false
        },
        completionDate: {
            type: DataTypes.DATE,
            field: 'completion_date',
            allowNull: false
        },
        tournamentType: {
            type: DataTypes.ENUM(['Grand Slam', 'Masters 1000']),
            allowNull: false
        }
    });
};

export function player(sequelize) {
    return sequelize.define('Player', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING(30),
            field: 'first_name',
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(30),
            field: 'last_name',
            allowNull: false
        },
        birthCountry: {
            type: DataTypes.INTEGER,
            field: 'birth_country_id',
            references: {
                model: 'Country',
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            },
            allowNull: false
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            field: 'date_of_birth',
            allowNull: false
        },
        currentPoints: {
            type: DataTypes.INTEGER,
            field: 'current_points',
            allowNull: false
        },
        livePoints: {
            type: DataTypes.INTEGER,
            field: 'live_points',
            allowNull: false
        },
        rank: {
            type: DataTypes.INTEGER,
            field: 'player_rank',
            allowNull: true
        }
    });
};

export function income(sequelize) {
    return sequelize.define('Income', {
        tournamentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'tournament_id',
            references: {
                model: 'Tournament',
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        playerId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'player_id',
            references: {
                model: 'Player',
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
};

export function matches(sequelize) {
    return sequelize.define('Matches', {
        tournamentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'tournament_id',
            references: {
                model: 'Tournament',
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        firstPlayerId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'first_player_id',
            references: {
                model: 'Player',
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        secondPlayerId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'second_player_id',
            references: {
                model: 'Player',
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        matchDate: {
            type: DataTypes.DATE,
            field: 'match_date',
            allowNull: false
        },
        round: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        result: {
            type: DataTypes.STRING(5),
            allowNull: true
        },
        winnerId: {
            type: DataTypes.INTEGER,
            field: 'winner_id',
            references: {
                model: 'Player',
                key: 'id',
                deferrable: Deferrable.NOT
            }
        }
    });
};

export function statistics(sequelize) {
    return sequelize.define('Statistics', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tournamentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'tournament_id',
            references: {
                model: 'Match',
                key: 'tournament_id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        firstPlayerId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'first_player_id',
            references: {
                model: 'Match',
                key: 'first_player_id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        secondPlayerId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: 'second_player_id',
            references: {
                model: 'Match',
                key: 'second_player_id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        firstPlayerPoints: {
            type: DataTypes.INTEGER,
            field: 'first_player_points',
            allowNull: false
        },
        secondPlayerPoints: {
            type: DataTypes.INTEGER,
            field: 'second_player_points',
            allowNull: false
        }
    });
};