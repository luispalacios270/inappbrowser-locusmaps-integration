LocusMaps.onReady(function() {
  LocusMaps.observe(function(eventName, newLevelId) {
    if (eventName === "level") {
      const iconContainer = document.getElementById("icon");
      if (newLevelId.levelId === "lhr-t2-1")
        iconContainer.style.display = "block";
      else iconContainer.style.display = "none";
    }
  });
});
