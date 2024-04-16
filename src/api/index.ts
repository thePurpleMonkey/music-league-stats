import { Member } from 'components/member';
import { League } from 'components/league';
import { Round } from 'components/round';
import { Submission } from 'components/submission';
import { Track } from 'components/track';
import { Vote } from 'components/vote';
import { Votes } from 'components/votes';
import { Placement } from 'components/placement';
import { plainToInstance } from 'class-transformer';


export class LeagueApi {
    private static BASE_URL = "https://musicleaguestats.michaelhumphrey.dev/api/v1/";

    async get_leagues(): Promise<League[]> {
        return fetch(new URL("leagues", LeagueApi.BASE_URL)).then(async (response) => {
            const data = await response.json() as unknown[]
            const leagues: League[] = plainToInstance(League, data);
            console.log("Retrieved leagues:", leagues);
            return leagues;
        });
    }

    async get_submissions(round_id: string): Promise<Submission[]> {
        return fetch(new URL(`submissions/${round_id}`, LeagueApi.BASE_URL)).then(async (response) => {
            const data = await response.json() as unknown[]
            const submissions: Submission[] = plainToInstance(Submission, data);
            console.log("Retrieved submissions:", submissions);
            submissions.sort((a, b) => b.votes.reduce((sum, bv) => sum + bv.votes, 0) - a.votes.reduce((sum, av) => sum + av.votes, 0));
            console.log("Sorted submissions:", submissions);
            
            return submissions;
        });
    }

    async get_round_voters(round_id: string): Promise<Votes[]> {
        return fetch(new URL(`voters/${round_id}`, LeagueApi.BASE_URL)).then(async (response) => {
            const data = await response.json() as unknown[]
            const votes: Votes[] = plainToInstance(Votes, data);
            console.log("Retrieved votes:", votes);

            votes.forEach(voter => {
                voter.votes = voter.votes.sort((a, b) => b.votes - a.votes);
            });
            // votes.sort((a, b) => b.votes.reduce((sum, bv) => sum + bv.votes, 0) - a.votes.reduce((sum, av) => sum + av.votes, 0));
            console.log("Sorted votes:", votes);
            
            return votes;
        });
    }

    async get_league_members(league_id: string): Promise<Member[]> {
        return fetch(new URL(`leagues/${league_id}/members`, LeagueApi.BASE_URL)).then(async (response) => {
            const data = await response.json() as unknown[]
            const members: Member[] = plainToInstance(Member, data);
            console.log("Retrieved members:", members);
            return members;
        });
    }

    async get_votes_received(league_id: string, member_id: string): Promise<Vote[]> {
        return fetch(new URL(`leagues/${league_id}/members/${member_id}/votes_received`, LeagueApi.BASE_URL)).then(async (response) => {
            const data = await response.json() as unknown[]
            const votes: Vote[] = plainToInstance(Vote, data);
            console.log("Retrieved votes:", votes);
            return votes;
        });
    }

    async get_votes_given(league_id: string, member_id: string): Promise<Vote[]> {
        return fetch(new URL(`leagues/${league_id}/members/${member_id}/votes_given`, LeagueApi.BASE_URL)).then(async (response) => {
            const data = await response.json() as unknown[]
            const votes: Vote[] = plainToInstance(Vote, data);
            console.log("Retrieved votes:", votes);
            return votes;
        });
    }

    async get_member(member_id: string): Promise<Member> {
        return fetch(new URL(`members/${member_id}`, LeagueApi.BASE_URL)).then(async (response) => {
            const data = await response.json() as unknown
            const member: Member = plainToInstance(Member, data);
            console.log("Retrieved member:", member);
            return member;
        });
    }

    async get_round_standings(league_id: string, member_id: string): Promise<Vote[]> {
        return fetch(new URL(`leagues/${league_id}/members/${member_id}/round_standings`, LeagueApi.BASE_URL)).then(async (response) => {
            const data = await response.json() as unknown[]
            const votes: Vote[] = plainToInstance(Vote, data);
            console.log("Retrieved votes:", votes);
            return votes;
        });
    }

    async get_rounds(league_id: string): Promise<Round[]> {
        return fetch(new URL(`leagues/${league_id}/rounds`, LeagueApi.BASE_URL)).then(async (response) => {
            const data = await response.json() as unknown[]
            const rounds: Round[] = plainToInstance(Round, data);
            console.log("Retrieved rounds:", rounds);
            return rounds;
        });
    }

    async get_round_rankings(round_id: string): Promise<Placement[]> {
        return fetch(new URL(`rounds/${round_id}/rankings`, LeagueApi.BASE_URL)).then(async (response) => {
            const data = await response.json() as unknown[]
            const rankings: Placement[] = plainToInstance(Placement, data);
            console.log("Retrieved placements:", rankings);
            return rankings;
        });
    }

    async get_round(round_id: string): Promise<Round> {
        return fetch(new URL(`rounds/${round_id}`, LeagueApi.BASE_URL)).then(async (response) => {
            const data = await response.json() as unknown
            const round: Round = plainToInstance(Round, data);
            console.log("Retrieved round:", round);
            return round;
        });
    }

    async get_favorite_songs(league_id: string, member_id: string): Promise<Vote[]> {
        return fetch(new URL(`leagues/${league_id}/members/${member_id}/favorite_songs`, LeagueApi.BASE_URL)).then(async (response) => {
            const data = await response.json() as unknown[]
            const votes: Vote[] = plainToInstance(Vote, data);
            console.log("Retrieved votes:", votes);
            return votes;
        });
    }
}