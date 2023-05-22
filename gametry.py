import pygame

# Initialize Pygame
pygame.init()

# Set the width and height of the window
width = 800
height = 600

# Create the display surface
display_surface = pygame.display.set_mode((width, height))

# Set the window caption
pygame.display.set_caption('My Pygame Window')

# Main game loop
running = True
while running:
    # Process events
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Clear the display surface
    display_surface.fill((255, 255, 255))  # Fill with white color

    # Draw your game objects or perform other rendering operations here

    # Update the display
    pygame.display.update()

# Quit Pygame
pygame.quit()
