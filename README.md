# ECE1779 Project

## Motivation
### Background
Web-based games have long been a popular form of entertainment as they are easy to access, simple to play, and compatible with most devices. Their straightforward structure also makes them valuable for studying how interactive applications manage state and handle user actions in real time. 
Problem Statement and Need:
This project addresses the need for stable, continuous, and maintainable online games, while avoiding heavy system requirements or complex setups. Many existing gaming platforms focus on high-end graphics or large downloads, excluding users who prefer quick, browser-based experiences. To fill the gap, this project aims to develop a lightweight online gaming platform, which supports instant games, using cloud-based technologies online.
### Project Value
This project is worth pursuing as it offers a practical foundation for learning and applying modern web technologies such as cloud deployment, database integration, and real-time networking—skills valuable in current software development trends.
### Target Users
The target users include casual gamers, students learning web development, and individuals seeking quick entertainment through simple, device-independent gameplay. 
### Existing Products and Limitations
Our motivation for this project comes from several key observations about the limitations of existing online game systems and the potential benefits of cloud technologies. 
1. **Lack of Persistent State Management**

One major limitation of current online game systems is the lack of persistent state management. Game state such as game progress, scores, or user interactions are often stored temporarily only in memory or in local files, as most web games still rely on short-lived servers without external persistence [1]. This not only prevents players from resuming their games or reviewing their past sessions but also limits developers’ capability to analyze gameplay data. In contrast, a cloud-native architecture solves this by integrating persistent database storage. By using PostgreSQL with persistent volumes, game data can be restored under page refresh or system restart/upgrade, and are consistently available for future analysis, ensuring both stability and continuity for users. 

2. **Lack of Observability and Deployment Flexibility**

Another problem is the lack of observability and deployment flexibility in traditional online game platforms. Specifically, many small online games are deployed manually on a single server without automated monitoring or orchestration. This limitation, as noted in industry analyses, arises because traditional monitoring tools offer only limited visibility into system behavior and user experience [2]. When the service experiences performance issues or crashes, developers have limited visibility into resource usage or system health, making the maintenance of the system inefficient and error-prone. Conversely, a cloud-native approach can effectively address these challenges by using containerization and orchestration tools such as Docker Swarm and Fly.io Metrics to standardize deployment and collect runtime metrics. This allows developers to monitor system performance in real time and maintain consistent reliability across all environments.
### Conclusion
To address these challenges and evaluate the potential of cloud-native technologies, this project aims to develop a cloud-native online game platform that leverages cloud technologies to manage game states, persist user data, and analyze performance metrics across sessions. Ultimately, it seeks to explore how cloud-based architecture can enhance the stability, continuity, and maintainability of online gaming platforms.

## Objective and Key Features
### Objective:
The objective of this project is to develop a cloud-native gaming platform supporting single-player, offline multiplayer, and online multiplayer modes.
 
### Games Supported:
- Single Player: Digital Klotski, Tic Tac Toe, Reverse Chess.  
- Multiplayer Offline: Tic Tac Toe, Reverse Chess, on a single computer.  
- Multiplayer Online: Tic Tac Toe, Reverse Chess, for players across the internet.

Reverse Chess might be implemented depending on time available to the team.

### Orchestration:
- Local development is conducted through Docker Compose, for easy testing and deployment. At least two containers will be implemented, app and database.  
- Docker Swarm Mode is used to manage containerized and multi-host services, providing scalability and fault tolerance. Hosts will be used for database, backend game logics, frontend displays, etc.  
  - The expected product application is relatively small, so Docker Swarm Mode is chosen for its light weight and flexibility. Swarm is also tightly integrated with Docker, and that could simplify the development process for small projects.
 
### Database and Persistent Storage:
- PostgreSQL is used for game state storage, player profiles, and leaderboards.  
  - Users will be able to register, login with usernames and passwords, resume game state in Single Player and Multiplayer Offline modes, and enter a weekly refreshed leaderboard.
- Fly Volumes will be applied for persistent storage to ensure data durability.
  - After a restart of the whole system due to potential maintenance or upgrade, players will still be able to retrieve their games. 
- Database schema includes tables for users, game sessions, leaderboards.  
  - e.g. See examples below:
```
CREATE SCHEMA tictactoe;
-- Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Tic-tac-toe games table
CREATE TABLE tictactoe.games (
    user_id INTEGER PRIMARY KEY,
    board CHAR(9) NOT NULL
);
-- Tic-tac-toe leaderboard table
CREATE TABLE tictactoe. leaderboard (
    user_id INTEGER PRIMARY KEY,
    score INTEGER NOT NULL
);
```

### Deployment Provider:
- Fly.io is chosen for cloud deployment, leveraging global edge locations to reduce latency for online multiplayer games.

The team wants to focus more on application development and less on managing infrastructures, so fly.io is preferred over DigitalOcean as a PaaS platform. Fly.io also has the advantage to deploy applications across regions worldwide (closer to users), and this is very suitable for online gaming.  
 
### Monitoring and Observability:
- Basic alerts:
  - Fly.io logs and metrics will be set up for CPU, memory, disk usage.
  - Alerts will also be set up for general system health issues, such as high latency, or resource usage spikes.
- Functional alerts:
  - Monitors will be set up for user activities, to analyze the platform usage, potentially improve our application. E.g. High registration activity period, high gameplay activity period.
  - Monitors will be set up for leaderboard data, and may be set up for online matches to prevent cheating.
  - Event logging will be set up for player actions, such as new registrations, new game plays, and new online matchings.
 
### Advanced Features:
Depending on time, the team will implement the advanced features in the following order, with at least 2 completed.
- Backup and Recovery:  
  - Weekly or monthly snapshots of PostgreSQL databases will be taken to cloud storage depending on usage, to prevent data loss.
- Real-Time Functionality:  
  - WebSocket-based updates are applied for multiplayer online games to ensure smooth and synchronized gameplay.
- Serverless integration (Event triggered functionalities):  
  - Newly registered users will receive guides on how to use the platform and rules of the games, displayed on their screen.
  - They can get the same guide again upon request, corresponding API and frontend features will be implemented. E.g. new registration event and button click event.
- Integration with External Services:  
  - An endpoint will be built to automatically notify users about the leaderboard updates through email, using SendGrid, if they provide such information during registration and are willing to receive notifications.
  - Other notifications like new registration welcome will be optionally implemented.
 
### Fulfillment of Course Requirements:
Here is a summary of key features which are compliant with course requirements.
- Local development, containerization, and Orchestration (Technical Requirement 1 & 4):
  - Docker, Docker Compose, and Docker Swarm Mode.
- State Management (Technical Requirement 2):
  - PostgreSQL and Fly Volumes.
- Deployment Provider (Technical Requirement 3):
  - Fly.io.
- Monitoring and Observability (Technical Requirement 5):
  - Alerts on Fly.io logs/metrics.
- Additional Features:
  - Database backup and recovery.
  - WebSocket-based updates between users for real-time functionality.
 
These will deliver a practical gaming experience, and are aligned with the course’s objective for cloud-based application development.
Note that the team also planned extra features based on time availability. This section only shows basic features from project requirements. The complete list of features is discussed in all the sections above.
 
### Scope:
This project focuses on cloud computing elements. 
- The main scope of the project is to develop a cloud platform for simple gameplay and online match use, with fundamental features listed above to ensure basic gaming functionalities only.
- Sophisticated security designs and database designs are not in the scope. Game designs are also less focused.
  - However, these are all valuable features in an online gaming system and could therefore be some potential future works for improvements. The team is interested in pursuing them further after the course.

### Feasibility:
The objective and scope of the project is achievable within the course timeframe. Core gameplay mechanics and single-player modes will be implemented initially, followed by offline and online multiplayer features. Completion of offline Digital Klotski and Tic Tac Toe will be enough to demonstrate all course requirements. By exploring extra features (e.g. reverse chess and online matches), the team has flexibility to decide what to be implemented based on time available. This ensures completion of course expectations, while also keeping the project feasible.

Detailed plans and work distributions can be found in Section: Tentative Plan.

## Tentative Plan
This plan supports the project’s objective of building a cloud-native gaming platform with single and multiplayer online games (e.g., Tic Tac Toe, Klotski). 
It demonstrates key course concepts including Docker Swarm orchestration, PostgreSQL persistence, Fly.io deployment, and real-time WebSocket-based gameplay. The frontend will serve as a simple interface to showcase the cloud infrastructure, while both members will focus on building, deploying, and monitoring the full application stack.

The main division of responsibilities is as follows:

**Member A**

- Backend Services & Containerization
- Develop core backend APIs using Node.js and PostgreSQL for data persistence
- Containerize the backend using Docker and Docker Compose
- Define API endpoints (e.g., /events, /leaderboard) and handle frontend-backend integration
- Implement server-side logic for real-time communication (WebSocket-based multiplayer updates)
- End-to-end testing

**Member B**
  
- Cloud Deployment, Orchestration & Observability
- Deploying the application to Fly.io with persistent volume setup
- Setting up orchestration using Docker Swarm or Kubernetes
- Configure and manage WebSocket services for online multiplayer communication  
- Implementing monitoring and observability tools such as Fly.io metrics/logs
- End-to-end testing

Here is a tentative timeline for the next six weeks:  
Week1: Define system architecture, database schema, and development environments.  
Week2: Implement core backend functions for single-player games and prototype the frontend interface.  
Week3: Extend backend to support multiplayer modes and integrate real-time communication using WebSocket. Containerize all components and test communication locally with Docker Compose.  
Week4: Deploy the containerized application to Fly.io with orchestration and persistent volume configuration. Integrate monitoring and observability features.  
Week5: Conduct full end-to-end tests and prepare presentation slides.  
Week6: Prepare final project deliverables.  

## Conclusion
This project combines cloud computing, container orchestration, and modern web technologies to deliver a robust online gaming platform. By addressing the limitations of existing gaming solutions, it offers scalable, reliable, and interactive gaming experiences. The proposed design ensures persistent data storage, real-time gameplay, and comprehensive monitoring, making it an ideal demonstration of cloud-based application development and orchestration principles.

## Reference
[1] M. Seese, “Persistence for Ephemeral Game Servers,” Hathora Blog, Jan. 21, 2025. Accessed: Oct. 15, 2025. [Online]. Available: https://blog.hathora.dev/persistence-for-ephemeral-game-servers/  
[2] Stela Udovicic, “How Observability Can Improve Gaming - DevOps.com,” DevOps.com, Mar. 25, 2022. Accessed: Oct. 15, 2025. [Online]. Available: https://devops.com/how-observability-can-improve-gaming/?utm_source  
