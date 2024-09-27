import React, { useState } from 'react';
import './style.css'

export default function Leaderboard() {

    const [topScores, setTopScores] = useState();

    const sortLeaderboards = (data) => {
		setTopScores(
			data?.sort((a, b) => {
				return b.score - a.score;
			})
		);
	};

    return (
        <div className="leaderboard-container">
	
			<div className="leaderboard">

				<h1 className='leaderboardh1'>Leaderboard</h1>
	
				<table>
					<tbody>
						<tr id="firstRow">
							<th>Ranking</th>
							<th>Username</th>
							<th>Games Played</th>
                            <th>Total Wins</th>
                            <th>Wins as Hunter</th>
                            <th>Wins as Hider</th>
						</tr>

						{topScores?.slice(0, 10).map((user, index) => {
							return (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{user.username}</td>
									<td>{user.score}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
	
			</div>
		</div>
    )
}
