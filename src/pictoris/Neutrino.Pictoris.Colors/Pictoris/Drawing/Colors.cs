// <copyright file="Colors.cs" company="Division By Zero">
// Copyright (c) 2024 Dmitry Kolchev. All rights reserved.
// See LICENSE in the project root for license information
// </copyright>

using System.Collections.ObjectModel;

namespace Neutrino.Pictoris.Drawing;

public static class Colors
{
    public static readonly string DarkRed = "#750b1c";
    public static readonly string Burgundy = "#a4262c";
    public static readonly string Cranberry = "#c50f1f";
    public static readonly string Red = "#d13438";
    public static readonly string DarkOrange = "#da3b01";
    public static readonly string Bronze = "#a74109";
    public static readonly string Pumpkin = "#ca5010";
    public static readonly string Orange = "#f7630c";
    public static readonly string Peach = "#ff8c00";
    public static readonly string Marigold = "#eaa300";
    public static readonly string Yellow = "#fde300";
    public static readonly string Gold = "#c19c00";
    public static readonly string Brass = "#986f0b";
    public static readonly string Brown = "#8e562e";
    public static readonly string DarkBrown = "#4d291c";
    public static readonly string Lime = "#73aa24";
    public static readonly string Forest = "#498205";
    public static readonly string Seafoam = "#00cc6a";
    public static readonly string LightGreen = "#13a10e";
    public static readonly string Green = "#107c10";
    public static readonly string DarkGreen = "#0b6a0b";
    public static readonly string LightTeal = "#00b7c3";
    public static readonly string Teal = "#038387";
    public static readonly string DarkTeal = "#006666";
    public static readonly string Cyan = "#0099bc";
    public static readonly string Steel = "#005b70";
    public static readonly string LightBlue = "#3a96dd";
    public static readonly string Blue = "#0078d4";
    public static readonly string RoyalBlue = "#004e8c";
    public static readonly string DarkBlue = "#003966";
    public static readonly string Cornflower = "#4f6bed";
    public static readonly string Navy = "#0027b4";
    public static readonly string Lavender = "#7160e8";
    public static readonly string Purple = "#5c2e91";
    public static readonly string DarkPurple = "#401b6c";
    public static readonly string Orchid = "#8764b8";
    public static readonly string Grape = "#881798";
    public static readonly string Berry = "#c239b3";
    public static readonly string Lilac = "#b146c2";
    public static readonly string Pink = "#e43ba6";
    public static readonly string HotPink = "#e3008c";
    public static readonly string Magenta = "#bf0077";
    public static readonly string Plum = "#77004d";
    public static readonly string Beige = "#7a7574";
    public static readonly string Mink = "#5d5a58";
    public static readonly string Silver = "#859599";
    public static readonly string Platinum = "#69797e";
    public static readonly string Anchor = "#394146";
    public static readonly string Charcoal = "#393939";

    private static readonly string[] baseColorNames = [
        nameof(DarkRed),
        nameof(Burgundy),
        nameof(Cranberry),
        nameof(Red),
        nameof(DarkOrange),
        nameof(Bronze),
        nameof(Pumpkin),
        nameof(Orange),
        nameof(Peach),
        nameof(Marigold),
        nameof(Yellow),
        nameof(Gold),
        nameof(Brass),
        nameof(Brown),
        nameof(DarkBrown),
        nameof(Lime),
        nameof(Forest),
        nameof(Seafoam),
        nameof(LightGreen),
        nameof(Green),
        nameof(DarkGreen),
        nameof(LightTeal),
        nameof(Teal),
        nameof(DarkTeal),
        nameof(Cyan),
        nameof(Steel),
        nameof(LightBlue),
        nameof(Blue),
        nameof(RoyalBlue),
        nameof(DarkBlue),
        nameof(Cornflower),
        nameof(Navy),
        nameof(Lavender),
        nameof(Purple),
        nameof(DarkPurple),
        nameof(Orchid),
        nameof(Grape),
        nameof(Berry),
        nameof(Lilac),
        nameof(Pink),
        nameof(HotPink),
        nameof(Magenta),
        nameof(Plum),
        nameof(Beige),
        nameof(Mink),
        nameof(Silver),
        nameof(Platinum),
        nameof(Anchor),
        nameof(Charcoal)
    ];

    private static readonly Dictionary<string, string> baseColors = new(StringComparer.OrdinalIgnoreCase)
    {
        [nameof(DarkRed)] = "#750b1c",
        [nameof(Burgundy)] = "#a4262c",
        [nameof(Cranberry)] = "#c50f1f",
        [nameof(Red)] = "#d13438",
        [nameof(DarkOrange)] = "#da3b01",
        [nameof(Bronze)] = "#a74109",
        [nameof(Pumpkin)] = "#ca5010",
        [nameof(Orange)] = "#f7630c",
        [nameof(Peach)] = "#ff8c00",
        [nameof(Marigold)] = "#eaa300",
        [nameof(Yellow)] = "#fde300",
        [nameof(Gold)] = "#c19c00",
        [nameof(Brass)] = "#986f0b",
        [nameof(Brown)] = "#8e562e",
        [nameof(DarkBrown)] = "#4d291c",
        [nameof(Lime)] = "#73aa24",
        [nameof(Forest)] = "#498205",
        [nameof(Seafoam)] = "#00cc6a",
        [nameof(LightGreen)] = "#13a10e",
        [nameof(Green)] = "#107c10",
        [nameof(DarkGreen)] = "#0b6a0b",
        [nameof(LightTeal)] = "#00b7c3",
        [nameof(Teal)] = "#038387",
        [nameof(DarkTeal)] = "#006666",
        [nameof(Cyan)] = "#0099bc",
        [nameof(Steel)] = "#005b70",
        [nameof(LightBlue)] = "#3a96dd",
        [nameof(Blue)] = "#0078d4",
        [nameof(RoyalBlue)] = "#004e8c",
        [nameof(DarkBlue)] = "#003966",
        [nameof(Cornflower)] = "#4f6bed",
        [nameof(Navy)] = "#0027b4",
        [nameof(Lavender)] = "#7160e8",
        [nameof(Purple)] = "#5c2e91",
        [nameof(DarkPurple)] = "#401b6c",
        [nameof(Orchid)] = "#8764b8",
        [nameof(Grape)] = "#881798",
        [nameof(Berry)] = "#c239b3",
        [nameof(Lilac)] = "#b146c2",
        [nameof(Pink)] = "#e43ba6",
        [nameof(HotPink)] = "#e3008c",
        [nameof(Magenta)] = "#bf0077",
        [nameof(Plum)] = "#77004d",
        [nameof(Beige)] = "#7a7574",
        [nameof(Mink)] = "#5d5a58",
        [nameof(Silver)] = "#859599",
        [nameof(Platinum)] = "#69797e",
        [nameof(Anchor)] = "#394146",
        [nameof(Charcoal)] = "#393939"
    };

    private static ReadOnlyCollection<string>? s_baseColorNames;

    public static IEnumerable<string> GetColorNames()
    {
        return s_baseColorNames ??= new ReadOnlyCollection<string>(baseColorNames);
    }

    public static string GetColor(string colorName)
    {
        return baseColors[colorName];
    }
}
