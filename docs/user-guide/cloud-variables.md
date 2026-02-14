---
title: Cloud Variables
sidebar_position: 7
---

# Cloud Variables

Cloud variables in MistWarp provide shared data storage and enable real-time collaboration between users. MistWarp uses a cloud server compatible with Scratch’s protocol.

## Understanding Cloud Variables

### What Are Cloud Variables?
Cloud variables are special variables that:
- **Sync**: Share data between different users in real time
- **Global**: Accessible to all active instances of your project
- **Server-backed**: Stored on a cloud server while users are connected

### Limitations
- **Numbers only**: Cloud variables only hold numbers
- **Length limit**: Up to 100,000 characters
- **Buffering**: Updates may be batched and reordered; sending over ~10 per second is redundant

## Creating Cloud Variables

### In MistWarp Editor

#### Basic Creation
1. Go to **Variables** category in blocks palette
2. Click **Make a Variable**
3. Enter variable name
4. Check **☁ Cloud variable** checkbox
5. Click **OK**

#### Naming Conventions
- Use descriptive names: `☁ high_score`, `☁ player_data`
- Avoid spaces: Use underscores instead
- Keep names short but meaningful
- Consider data type: `☁ json_data`, `☁ user_count`

### Cloud Variable Blocks

#### Set Cloud Variable
```scratch
set [☁ high_score v] to (1000)
```

#### Read Cloud Variable
```scratch
say (☁ high_score) for (2) seconds
```

#### Change Cloud Variable
```scratch
change [☁ user_count v] by (1)
```

## Data Formats

### Simple Values
Store simple text and numbers:
```scratch
set [☁ high_score v] to (1000)
set [☁ player_name v] to [Alice]
set [☁ game_state v] to [playing]
```

### Structured Data
Use delimiters for complex data:
```scratch
// Comma-separated values
set [☁ player_stats v] to (join (username) (join [,] (join (score) (join [,] (level)))))

// JSON-like format
set [☁ game_data v] to [{"score":1000,"level":5,"lives":3}]
```

### List Simulation
Simulate lists using cloud variables:
```scratch
// Add item to list
set [☁ item_list v] to (join (☁ item_list) (join [|] (new_item)))

// Get item from list
set [item v] to (item (1) of (split (☁ item_list) by [|]))
```

## Real-Time Features

### Live Synchronization
Cloud variables update in real-time across all connected users:

```scratch
// User counter system
when green flag clicked
change [☁ user_count v] by (1)

when I receive [user_left v]
change [☁ user_count v] by (-1)
```

### Event Broadcasting
Create real-time events using cloud variables:

```scratch
// Event trigger
when green flag clicked
forever
  if <(☁ global_event) = [start_game]> then
    broadcast [game_started v]
    set [☁ global_event v] to [none]
  end
end

// Event sender
when [space v] key pressed
set [☁ global_event v] to [start_game]
```

## Advanced Patterns

### Chat System
Implement a basic chat using cloud variables:

```scratch
// Send message
when [enter v] key pressed
set [☁ chat_log v] to (join (☁ chat_log) (join [|] (join (username) (join [:] (message)))))

// Display messages
when green flag clicked
forever
  set [messages v] to (split (☁ chat_log) by [|])
  // Display logic here
end
```

### Multiplayer State
Synchronize player positions:

```scratch
// Update player position
when green flag clicked
forever
  set [☁ player_data v] to (join (username) (join [,] (join (x position) (join [,] (y position)))))
  wait (0.1) seconds
end

// Read other players
when green flag clicked
forever
  set [other_players v] to (split (☁ all_players) by [|])
  // Process other player data
end
```

### Leaderboard System
Create persistent leaderboards:

```scratch
// Submit score
when [game over v] received
if <(score) > (☁ high_score)> then
  set [☁ high_score v] to (score)
  set [☁ high_score_player v] to (username)
end

// Display leaderboard
when green flag clicked
forever
  say (join [High Score: ] (join (☁ high_score) (join [ by ] (☁ high_score_player)))) for (2) seconds
end
```

## Server Configuration

### Custom Cloud Host
Override the cloud server with a URL parameter:
```
https://warp.mistium.com/?cloud_host=wss://clouddata.turbowarp.org
```

MistWarp uses `wss://` by default. Insecure `ws://` hosts may not work in HTTPS environments.

## Best Practices

### Data Management

#### Minimize Updates
- Batch multiple changes
- Only update when necessary
- Use local variables for temporary data

#### Structure Data Efficiently
```scratch
// Good: Structured format
set [☁ player_data v] to [alice,100,5,active]

// Better: JSON-like format
set [☁ player_data v] to [{"name":"alice","score":100,"level":5,"status":"active"}]
```

#### Handle Large Data
```scratch
// Split large data across variables
set [☁ data_part_1 v] to (letters (1) to (50000) of (large_data))
set [☁ data_part_2 v] to (letters (50001) to (100000) of (large_data))
```

### Error Handling

#### Network Issues
```scratch
// Check if cloud variables are working
if <(☁ test_variable) = []> then
  say [Cloud variables not available] for (2) seconds
else
  say [Cloud variables working] for (2) seconds
end
```

#### Data Validation
```scratch
// Validate cloud data
if <(length of (☁ player_data)) > (0)> then
  // Process data
else
  // Use default values
end
```

### Performance Optimization

#### Reduce Update Frequency
```scratch
// Update every 5 seconds instead of continuously
when green flag clicked
forever
  // Update cloud variables
  wait (5) seconds
end
```

#### Use Local Caching
```scratch
// Cache cloud data locally
set [cached_data v] to (☁ remote_data)
// Use cached_data for frequent reads
```

## Troubleshooting

### Common Issues

#### Variables Not Syncing
- Check internet connection
- Verify project is shared
- Ensure variable name starts with ☁
- Avoid very frequent updates

#### Data Loss
- Implement periodic backups
- Use multiple variables for redundancy
- Validate data before saving

#### Performance Problems
- Reduce update frequency
- Minimize data size
- Use efficient data structures

### Debug Tools

#### Cloud Variable Monitor
```scratch
// Monitor cloud variable changes
when green flag clicked
forever
  if <not <(☁ debug_var) = (last_value)>> then
    say (join [Changed: ] (☁ debug_var)) for (1) seconds
    set [last_value v] to (☁ debug_var)
  end
end
```

#### Connection Status
```scratch
// Test cloud connectivity
set [☁ test_ping v] to (timer)
wait (1) seconds
if <(☁ test_ping) = (timer)> then
  say [Cloud variables offline] for (2) seconds
else
  say [Cloud variables online] for (2) seconds
end
```

Cloud variables unlock powerful collaborative and persistent features in MistWarp. Use them to create multiplayer games, shared experiences, and data-driven projects that persist across sessions!
