// Create custom styles

export const SciFiTheme = {
    backgroundColor: 0x0000AA,
    borderColor: 0x00AAFF,
    borderThickness: 3,
    borderRadius: 0,
    defaultColor: '#00FFFF',
    defaultFont: 'Courier New',
    typewriterSpeed: 20
}


// back to it

/**
         Create button to trigger dialog
         const button1 = this.add.text(100, 100, 'Show Sci-fi Dialog', { backgroundColor: '#333' })
             .setInteractive()
             .setPadding(10)
             .on('pointerup', () => {
                 // Apply style and show dialog
                 GameManager.dialog.applyStyle('sci-fi');
                 GameManager.dialog.show([
                     {
                         text: "Greetings, Commander. I've detected an anomaly in sector 7.",
                         name: "A.I.",
                         nameColor: "#00AFFF",
                         portrait: "portrait1"
                     },
                     {
                         text: "This could be the alien signal we've been searching for. Shall I initiate scan protocol?",
                         color: "#AAFFFF",
                         portrait: "portrait1",
                         highlightWords: [
                             { word: "alien signal", color: "#FF00FF" }
                         ]
                     }
                 ]);
             });
 */