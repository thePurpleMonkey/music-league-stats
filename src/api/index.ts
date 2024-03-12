import { Member } from 'components/member';
import { League } from 'components/league';
import { Round } from 'components/round';
import { Submission } from 'components/submission';
import { Track } from 'components/track';
import { Vote } from 'components/vote';
// import * as SQL from 'sql.js';
import initSqlJs, { Database } from "sql.js";
import { Votes } from 'components/votes';
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

    async get_submissions(round_id: string): Promise<Submission[]> {
        if (!this.database) {
            await this.connect();
        }

        const submissions = new Map<string, Submission>()

        const members = await this.get_members();
        console.log("Members:", members);
        const result = this.database.exec("SELECT voter_id, recipient_id, votes, track_id, name, picture, comment FROM results JOIN track_names ON track_id = track_names.id WHERE round_id = $round_id", { "$round_id": round_id });
        console.log(`Retrieved ${result.length} records.`);
        if (result.length > 0 && result[0].values) {
            const rows = result[0].values;
            rows.forEach(row => {
                const voter: Member = members.get(row[0].toString());
                const recipient: Member = members.get(row[1].toString());
                const vote_num = row[2].valueOf() as number;
                const track_id = row[3].toString();
                const track_name = row[4].toString();
                const track_picture = row[5].toString();
                const track = new Track(track_id, track_name, track_picture, recipient);
                const vote = new Vote(voter, vote_num, row[6].toString(), track);

                if (submissions.has(recipient.id)) {
                    submissions.get(recipient.id).votes.push(vote);
                } else {
                    submissions.set(recipient.id, new Submission(track, recipient, [vote]))
                }
            });
        }

        return [...submissions.values()];
    }

    async get_round_voters(round_id: string): Promise<Votes[]> {
        if (!this.database) {
            await this.connect();
        }

        const votes = new Map<string, Votes>()

        const members = await this.get_members();
        console.log("Members:", members);
        const result = this.database.exec("SELECT voter_id, recipient_id, votes, track_id, name, picture, comment FROM results JOIN track_names ON track_id = track_names.id WHERE round_id = $round_id ", { "$round_id": round_id });
        console.log(`Retrieved ${result.length} records.`);
        if (result.length > 0 && result[0].values) {
            const rows = result[0].values;
            rows.forEach(row => {
                const voter: Member = members.get(row[0].toString());
                const recipient: Member = members.get(row[1].toString());
                const vote_num = row[2].valueOf() as number;
                const track_id = row[3].toString();
                const track_name = row[4].toString();
                const track_picture = row[5].toString();
                const track = new Track(track_id, track_name, track_picture, recipient);
                const vote = new Vote(voter, vote_num, row[6].toString(), track);

                if (votes.has(voter.id)) {
                    votes.get(voter.id).votes.push(vote);
                } else {
                    votes.set(voter.id, new Votes(voter, [vote]))
                }
            });
        }

        const voters = [...votes.values()];
        voters.forEach(voter => {
            voter.votes = voter.votes.sort((a, b) => b.votes - a.votes);
        });
        // console.log(voters);
        // console.log(voters.map(voter => voter.votes.sort((a, b) => b.votes - a.votes)))

        return voters;
    }

    async get_members(): Promise<Map<string, Member>> {
        if (!this.database) {
            await this.connect();
        }

        const members: Map<string, Member> = new Map();
        const result = this.database.exec("SELECT id, name, picture FROM members");
        console.log(`Retrieved ${result.length} members.`);
        if (result.length > 0 && result[0].values) {
            const rows = result[0].values;
            rows.forEach(row => {
                const id = row[0].toString();
                const name = row[1].toString();
                const picture = row[2].toString();
                members.set(id, new Member(id, name, picture));
            });
        }

        return members;
    }
}