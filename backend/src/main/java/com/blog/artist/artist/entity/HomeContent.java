package com.blog.artist.artist.entity;

import jakarta.persistence.*;

/**
 * Stores the home page poem, quote, and bio button label per language.
 *
 * DB table: home_content
 * Columns : id, language (E/T/H), poem, quote, bio_button
 *
 * SQL to create:
 *   CREATE TABLE home_content (
 *     id        BIGINT AUTO_INCREMENT PRIMARY KEY,
 *     language  VARCHAR(2)   NOT NULL UNIQUE,
 *     poem      TEXT         NOT NULL,
 *     quote     TEXT         NOT NULL,
 *     bio_button VARCHAR(50) NOT NULL DEFAULT 'Bio'
 *   );
 *
 * Seed data:
 *   INSERT INTO home_content (language, poem, quote, bio_button) VALUES
 *   ('E', 'He painted the world in whispers of light,\nWhere skies breathed softly...', '"I am forever grateful..."', 'Bio'),
 *   ('T', 'ఆయన వెలుతురు గుసగుసలతో జగమును చిత్రించాడు,...',  'నా జీవన పయనంలో...', 'జీవిత చరిత్ర'),
 *   ('H', 'उन्होंने जगत को रोशनी की फुसफुसाहटों में चित्रित किया,...', 'मैं अपने परिवार...', 'जीवनी');
 *
 * The poem is stored as plain text with \n line breaks.
 * The frontend splits on \n and renders each line with <br/>.
 */
@Entity
@Table(name = "home_content")
public class HomeContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Language flag: E = English, T = Telugu, H = Hindi */
    @Column(nullable = false, unique = true, length = 2)
    private String language;

    /** Poem text — store lines separated by \n */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String poem;

    /** Quote / artist statement */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String quote;

    /** Label for the Bio button, e.g. "Bio", "జీవిత చరిత్ర", "जीवनी" */
    @Column(name = "bio_button", nullable = false, length = 50)
    private String bioButton = "Bio";

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getPoem() { return poem; }
    public void setPoem(String poem) { this.poem = poem; }

    public String getQuote() { return quote; }
    public void setQuote(String quote) { this.quote = quote; }

    public String getBioButton() { return bioButton; }
    public void setBioButton(String bioButton) { this.bioButton = bioButton; }
}