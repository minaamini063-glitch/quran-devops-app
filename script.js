const surahSelect = document.getElementById("surahSelect");
const surahTitle = document.getElementById("surahTitle");
const surahText = document.getElementById("surahText");

async function loadSurahList() {
  try {
    const response = await fetch("https://api.alquran.cloud/v1/surah");
    const data = await response.json();

    surahSelect.innerHTML = '<option value="">-- Choose a Surah --</option>';

    data.data.forEach(surah => {
      const option = document.createElement("option");
      option.value = surah.number;
      option.textContent = `${surah.number}. ${surah.englishName} - ${surah.name}`;
      surahSelect.appendChild(option);
    });
  } catch (error) {
    surahSelect.innerHTML = '<option>Error loading Surahs</option>';
    console.error(error);
  }
}

async function showSurah() {
  const surahNumber = surahSelect.value;

  if (surahNumber === "") {
    surahTitle.textContent = "Surah will appear here";
    surahText.innerHTML = "Please choose a Surah from the list.";
    return;
  }

  surahTitle.textContent = "Loading...";
  surahText.innerHTML = "";

  const arabicResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`);
  const englishResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`);

  const arabicData = await arabicResponse.json();
  const englishData = await englishResponse.json();

  const arabicAyahs = arabicData.data.ayahs;
  const englishAyahs = englishData.data.ayahs;

  surahTitle.textContent = `${arabicData.data.englishName} - ${arabicData.data.name}`;

  let content = "";

  // Show Bismillah separately except Al-Fatiha and At-Tawbah
  if (surahNumber != 1 && surahNumber != 9) {
    content += `
      <div class="ayah-card">
        <p class="arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <p class="english">In the name of Allah, the Most Gracious, the Most Merciful.</p>
      </div>
    `;
  }

  for (let i = 0; i < arabicAyahs.length; i++) {
    let arabicText = arabicAyahs[i].text;

    if (i === 0 && surahNumber != 1 && surahNumber != 9) {
      arabicText = arabicText
        .replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/u, "")
        .replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/u, "")
        .trim();
    }

    content += `
      <div class="ayah-card">
        <p class="arabic">
          ${arabicText}
          <span class="ayah-number">(${arabicAyahs[i].numberInSurah})</span>
        </p>
        <p class="english">
          ${englishAyahs[i].text}
          (${englishAyahs[i].numberInSurah})
        </p>
      </div>
    `;
  }

  surahText.innerHTML = content;
}

loadSurahList();