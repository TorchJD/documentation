document.addEventListener("DOMContentLoaded", function () {
  fetch("/versions.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch versions.json");
      }
      return response.json();
    })
    .then(versions => {
      const currentPath = window.location.pathname;
      const currentVersion = versions.find(v => currentPath.startsWith("/" + v + "/")) || versions[0];

      const selector = document.createElement("select");
      selector.className = "version-selector";
      selector.setAttribute("aria-label", "Select documentation version");
      selector.id = "version-selector"; // Add an id for accessibility
      selector.name = "version-selector"; // Add a name to satisfy autofill requirements

      versions.forEach(version => {
        const option = document.createElement("option");
        option.value = "/" + version + "/";
        option.textContent = version;
        if ("/" + version + "/" === "/" + currentVersion + "/") {
          option.selected = true;
        }
        selector.appendChild(option);
      });

      selector.addEventListener("change", () => {
        const selectedVersion = selector.value;
        const currentPage = currentPath.replace("/" + currentVersion + "/", "");
        window.location.href = selectedVersion + currentPage;
      });

      const label = document.createElement("label");
      label.textContent = "Version:";
      label.className = "version-label"; // Assign a CSS class to the label
      label.setAttribute("for", selector.id); // Add for attribute for accessibility

      const container = document.createElement("div");
      container.className = "version-container"; // Assign a CSS class for styling
      container.appendChild(label);
      container.appendChild(selector);

      // Insert at the top of the sidebar
      const sidebar = document.querySelector("div.sidebar-scroll");
      sidebar.appendChild(container, sidebar.children[0]);
    })
    .catch(error => {
      console.error("Version selector error:", error);
    });
});
