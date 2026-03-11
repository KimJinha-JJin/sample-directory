const DATA_URL = "data/milestones.json";

const createStat = (stat) => {
  const container = document.createElement("div");
  const value = document.createElement("span");
  value.className = "stat-value";
  value.textContent = stat.value;

  const label = document.createElement("span");
  label.className = "stat-label";
  label.textContent = stat.label;

  container.append(value, label);
  return container;
};

const createCard = (item) => {
  const card = document.createElement("article");
  card.className = "card";

  const title = document.createElement("h3");
  title.textContent = item.title;

  const description = document.createElement("p");
  description.textContent = item.description;

  card.append(title, description);
  return card;
};

const createTimelineItem = (item) => {
  const container = document.createElement("div");
  container.className = "timeline-item";

  const heading = document.createElement("h4");
  heading.textContent = `${item.year} · ${item.title}`;

  const description = document.createElement("p");
  description.textContent = item.description;

  container.append(heading, description);
  return container;
};

const renderData = (data) => {
  const heroTag = document.querySelector("[data-hero-tag]");
  const heroHeadline = document.querySelector("[data-hero-headline]");
  const heroDescription = document.querySelector("[data-hero-description]");

  if (heroTag) heroTag.textContent = data.hero.tag;
  if (heroHeadline) heroHeadline.textContent = data.hero.headline;
  if (heroDescription) heroDescription.textContent = data.hero.description;

  const statsContainer = document.querySelector("[data-stats]");
  if (statsContainer) {
    statsContainer.innerHTML = "";
    data.stats.forEach((stat) => statsContainer.append(createStat(stat)));
  }

  const highlightsContainer = document.querySelector("[data-highlights]");
  if (highlightsContainer) {
    highlightsContainer.innerHTML = "";
    data.highlights.forEach((item) => highlightsContainer.append(createCard(item)));
  }

  const timelineContainer = document.querySelector("[data-timeline]");
  if (timelineContainer) {
    timelineContainer.innerHTML = "";
    data.timeline.forEach((item) => timelineContainer.append(createTimelineItem(item)));
  }
};

const init = async () => {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`데이터 로드 실패: ${response.status}`);
    }
    const data = await response.json();
    renderData(data);
  } catch (error) {
    console.error(error);
  }
};

init();
