import { Member } from 'components/member';
import { League } from 'components/league';
import { Round } from 'components/round';
import { Submission } from 'components/submission';
import { Track } from 'components/track';
import { Vote } from 'components/vote';
// import * as SQL from 'sql.js';
import initSqlJs, { Database } from "sql.js";
import { Votes } from 'components/votes';
import { Placement } from 'components/placement';
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

    // async get_rounds(league_id: string): Promise<Round[]> {
    //     if (!this.database) {
    //         await this.connect();
    //     }

    //     const rounds: Round[] = [];
    //     const result = this.database.exec("SELECT DISTINCT round_id, name FROM results JOIN rounds ON results.round_id = rounds.id WHERE results.league_id = $league_id ORDER BY sequence", { "$league_id": league_id });
    //     console.log(`Retrieved ${result.length} records.`);
    //     if (result.length > 0 && result[0].values) {
    //         const rows = result[0].values;
    //         rows.forEach(row => {
    //             rounds.push(new Round(row[0].toString(), row[1].toString()));
    //         });
    //     }

    //     return rounds;
    // }

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

    async get_league_members(league_id: string): Promise<Member[]> {
        if (!this.database) {
            await this.connect();
        }

        const members: Member[] = [];
        const result = this.database.exec("SELECT DISTINCT id, name, picture FROM members JOIN results ON results.voter_id = id WHERE league_id = $league_id ORDER BY name", { "$league_id": league_id });
        console.log(`Retrieved ${result.length} members.`);
        if (result.length > 0 && result[0].values) {
            const rows = result[0].values;
            rows.forEach(row => {
                const id = row[0].toString();
                const name = row[1].toString();
                const picture = row[2].toString();
                members.push(new Member(id, name, picture));
            });
        }

        return members;
    }

    async get_votes_received(league_id: string, member_id: string): Promise<Vote[]> {
        if (!this.database) {
            await this.connect();
        }

        const members = await this.get_members();
        const votes: Vote[] = []

        const result = this.database.exec("SELECT voter_id, SUM(votes) FROM results WHERE league_id = $league_id AND recipient_id = $member_id GROUP BY voter_id ORDER BY SUM(votes) DESC", { "$league_id": league_id, "$member_id": member_id });
        if (result.length > 0 && result[0].values) {
            const rows = result[0].values;
            rows.forEach(row => {
                votes.push(new Vote(members.get(row[0].toString()), row[1].valueOf() as number));
            });
        }

        return votes;
    }

    async get_votes_given(league_id: string, member_id: string): Promise<Vote[]> {
        if (!this.database) {
            await this.connect();
        }

        const members = await this.get_members();
        const votes: Vote[] = []

        const result = this.database.exec("SELECT recipient_id, SUM(votes) FROM results WHERE league_id = $league_id AND voter_id = $member_id GROUP BY recipient_id ORDER BY SUM(votes) DESC", { "$league_id": league_id, "$member_id": member_id });
        if (result.length > 0 && result[0].values) {
            const rows = result[0].values;
            rows.forEach(row => {
                votes.push(new Vote(members.get(row[0].toString()), row[1].valueOf() as number));
            });
        }

        return votes;
    }

    async get_member(member_id: string): Promise<Member> {
        if (!this.database) {
            await this.connect();
        }

        let member: Member;

        const result = this.database.exec("SELECT id, name, picture FROM members WHERE id = $member_id", { "$member_id": member_id });
        if (result.length > 0 && result[0].values) {
            const row = result[0].values[0];
            member = new Member(row[0].toString(), row[1].toString(), row[2].toString());
        }

        return member;
    }

    async get_round_standings(league_id: string, member_id: string): Promise<Vote[]> {
        if (!this.database) {
            await this.connect();
        }

        const member = (await this.get_members()).get(member_id);
        const rounds = await this.get_rounds(league_id);
        const votes: Vote[] = []

        const result = this.database.exec("SELECT round_id, SUM(votes) FROM results JOIN rounds ON results.round_id = rounds.id WHERE league_id = $league_id AND recipient_id = $member_id GROUP BY round_id ORDER BY sequence", { "$league_id": league_id, "$member_id": member_id });
        if (result.length > 0 && result[0].values) {
            const rows = result[0].values;
            rows.forEach(row => {
                const vote = new Vote(member, row[1].valueOf() as number);
                vote.round = rounds.find(r => r.id == row[0].toString());
                votes.push(vote);
            });
        }

        return votes;
    }

    async get_rounds(league_id: string): Promise<Round[]> {
        if (!this.database) {
            await this.connect();
        }

        const rounds: Round[] = [];

        const result = this.database.exec("SELECT round_id, name, SUM(votes) FROM results JOIN rounds ON results.round_id = rounds.id WHERE league_id = $league_id GROUP BY round_id ORDER BY sequence", { "$league_id": league_id });
        if (result.length > 0 && result[0].values) {
            const rows = result[0].values;
            rows.forEach(row => {
                rounds.push(new Round(row[0].toString(), row[1].toString(), row[2].valueOf() as number));
            });
        }

        return rounds;
    }

    async get_round_rankings(round_id: string): Promise<Placement[]> {
        if (!this.database) {
            await this.connect();
        }

        const ranking: Placement[] = [];
        const round = await this.get_round(round_id);
        let rank = 1;

        const result = this.database.exec("SELECT id, name, picture, SUM(votes) FROM results JOIN members ON results.recipient_id = members.id WHERE round_id = $round_id GROUP BY recipient_id ORDER BY SUM(votes) DESC", { "$round_id": round_id });
        if (result.length > 0 && result[0].values) {
            const rows = result[0].values;
            rows.forEach(row => {
                const member = new Member(row[0].toString(), row[1].toString(), row[2].toString());
                const placement = new Placement(member, round, row[3].valueOf() as number, rank);
                placement.round = round;
                ranking.push(placement);
                rank += 1;
            });
        }

        return ranking;
    }

    async get_round(round_id: string): Promise<Round> {
        if (!this.database) {
            await this.connect();
        }

        let round: Round;

        const result = this.database.exec("SELECT id, name, sequence, SUM(votes) FROM rounds JOIN results ON round_id = id WHERE id = $round_id GROUP BY recipient_id ORDER BY SUM(votes) DESC", { "$round_id": round_id });
        if (result.length > 0 && result[0].values) {
            const row = result[0].values[0];
            round = new Round(row[0].toString(), row[1].toString(), row[2].valueOf() as number);
        }

        return round;
    }
}