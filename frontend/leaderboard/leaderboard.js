// Load leaderboard
async function leaderBoard() {
    try {
        const res = await fetch("http://localhost:8080/api/klotski/leaderboard");
        const data = await res.json();
        // Find <tbody> inside the table with id= "leaderboard"
        const tbody = document.querySelector("#leaderboard tbody");
        // Clear existing rows
        tbody.innerHTML = "";
        if (data.length === 0){
            tbody.innerHTML = `
                <tr>
                    <td colspan="4">No records yet</td>
                </tr>  
            `;
            return;
        }

        // For each row in data, create a new table row
        data.forEach((row, index) => {
            const tr = document.createElement("tr");
            // Fill table
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${row.username}</td>
                <td>${row.best_steps}</td>
                <td>${new Date(row.created_at).toLocaleString()}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Failed to load leaderboard", err);
    } 
}

leaderBoard();