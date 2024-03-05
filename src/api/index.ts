import { League } from 'components/league';
import { Round } from 'components/round';
// import * as SQL from 'sql.js';
import initSqlJs, { Database } from "sql.js";
// import initSqlJs, * as SQL from 'sql.js/dist/sql-wasm.js'

const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });

export class LeagueApi {
    private database: Database = null;

    private async connect() {
        console.log("Connecting to database...");

        const response = await fetch("music_league.db");
        const buffer = await response.arrayBuffer();
        console.log("buffer:", buffer.byteLength);

        this.database = new SQL.Database(new Uint8Array(buffer));
        
        console.log("Database downloaded:", this.database)
    }

    async get_leagues(): Promise<League[]> {
        if (!this.database) {
            await this.connect();
        }

        const leagues: League[] = [];
        const result = this.database.exec("SELECT id, name FROM leagues");
        if (result.length > 0 && result[0].values) {
            const rows = result[0].values;
            rows.forEach(row => {
                leagues.push(new League(row[0], row[1]));
            });
        }

        return leagues;
    }

    async get_rounds(league_id: string): Promise<Round[]> {
        if (!this.database) {
            await this.connect();
        }

        const rounds: Round[] = [];
        console.log("Querying for league ID:", league_id);
        // const result = this.database.exec("SELECT DISTINCT round_id, name FROM results JOIN rounds ON results.round_id = rounds.id WHERE results.league_id = ':league_id'", { league_id: league_id });
        const result = this.database.exec("SELECT DISTINCT round_id, name FROM results JOIN rounds ON results.round_id = rounds.id WHERE results.league_id = $league_id", { "$league_id": league_id });
        console.log(`Retrieved ${result.length} records.`);
        if (result.length > 0 && result[0].values) {
            const rows = result[0].values;
            rows.forEach(row => {
                rounds.push(new Round(row[0], row[1]));
            });
        }

        return rounds;
    }
}