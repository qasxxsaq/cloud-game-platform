# ECE1779 Project
## Team Information
Zhiqi(Charles) Yu 1006718358
charlesyuzq.yu@mail.utoronto.ca

Yuchen Zoe 1006708779
yuchenzoe.xu@mail.utoronto.ca


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

## Objective
## Technical Stack
## Features
## User Guide
## Development Guide
## Deployment Information
## Individual Contributions
## Lessons Learned and Concluding Remarks


## Reference
[1] M. Seese, “Persistence for Ephemeral Game Servers,” Hathora Blog, Jan. 21, 2025. Accessed: Oct. 15, 2025. [Online]. Available: https://blog.hathora.dev/persistence-for-ephemeral-game-servers/  
[2] Stela Udovicic, “How Observability Can Improve Gaming - DevOps.com,” DevOps.com, Mar. 25, 2022. Accessed: Oct. 15, 2025. [Online]. Available: https://devops.com/how-observability-can-improve-gaming/?utm_source  
