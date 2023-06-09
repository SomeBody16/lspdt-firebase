# LSPD Tablet

> Los Santos Police Department Tablet to zarządzalna baza danych obywateli wyspy `Atomic RP`, opartym o system permisji i rang LSPD.
> [name=SomeBody16#7497 | Samuel Buddy] [color=#0f0]

## Bądź na bierząco

Na moim [serwerze discord](https://discord.gg/tpcVCUzGec) wstawiam na bieżąco aktualizacje oraz plany rozwoju tego tableu.

https://discord.gg/tpcVCUzGec

# Omówienie funkcji

## :family: Mieszkańcy

### Wyszukiwanie:
![](https://i.imgur.com/gou6CZr.png)

- **Skan dowodu (rekomendowany)**

Po [skopiowaniu zdjęcia](#Kopiowanie-zdjęcia-np-skan-dowodu) będąc w tym ekranie naciśnij klawisze `CTRL + V`, rozpocznie się proces wyszukiwania poprzez wyczytania danych obywatela z podanego skanu.

- Ręcznie (**zachowaj ostrożność**)

Wpisz ręcznie imię i nazwisko szukanego obywatela i sprawdź ponownie co wpisałeś w celu uniknięcia błędów (np. otwarcie kartoteki obywatela *Samuel Budy* zamiast *Samuel Buddy*)

Dostępne są dwa tryby wyszikiwania:
- **Tylko** po imieniu i nazwisko
- **Tylko** po numerze telefonu

### Wyniki wyszukiwania
![](https://i.imgur.com/TiStIwY.png)

Jeżeli obywatel istnieje, klikamy ikonkę *more* (trzy kropki po prawej) w celu przejścia na ekran [szczegółów obywatela](#Szczegóły-obywatela)

![](https://i.imgur.com/dRS690O.png)

Jeżeli obywatel **nie** istnieje, należy uzupełnić wszystkie 4 luki (w przypadku wybrania opcji wyszukiwania przez skan dowodu, dane uzupełnią się automatycznie)

**WAŻNE:** Sprawdź czy dane w `Imię` i `Nazwisko` są poprawne, aby nie stworzyć kartoteki dla nieistniejącego obywatela!!!


## Szczegóły obywatela
![](https://i.imgur.com/nlaH4GB.png)

> **Kartoteka**
> [color=red]
> Tutaj zapisywane jest wszystko co dotyczy danego obywatela.
> Między innymi: Wyroki, zmiany rangi, zatrudnienie, własne wpisy
> ___
> Aby usunąć wpis w kartotece, należy go rozwinąć, nacisnąć `PPM` na jego opisie, a następcie wybrać opcje `Usuń`

> **Informacje i akcje**
> [color=green]
> - Zdjęcie obywatela
> *Po [skopiowaniu zdjęcia](#Kopiowanie-zdjęcia-np-skan-dowodu) naciśnij `CTRL + V` na tym ekranie, aby ustawić zdjęcie obywatela. (**Limit: 1MB**)*
> - Informacje o obywatelu
> - Akcje
>   - `Aresztuj | Faktura`
>   *Przekierowuje do [Aresztuj | Faktura](#Aresztuj--Faktura)*
>   - `Nr. telefonu`
>   *Otwiera dialog do zmiany numeru telefonu*
>   - `Wpis w kartotece`
>   *Otwiera dialog do ręcznego wpisu do karoteki*
>   - `Zatrudnij`
>   *Tworzy konto policyjne oraz wysyła login i hasło na odpowiedni kanał zarządowy*
>   - `Anuluj poszukiwania`
>   *Zdejmuje status poszukiwanego z obywatela*
>   - `Informacje`
>   *Otwiera dialog do zmiany daty urodzenia oraz wzrostu obywatela*

## Aresztuj | Faktura
![](https://i.imgur.com/ypMQ3wO.png)

> **Taryfikator**
> [color=red]
> Lista wszystkich wpisów z [taryfikatora](#-Taryfikator)
> - `LPM/ PPM` - dodaje/odejmuje jedną sztukę
> - przycisk :speech_balloon: - pokazuje komentarz dotyczący zarzutu
> - przycisk `Rn`
>   - `LPM/ PPM` - dodaje/odejmuje poziom recydywy dla obywatela
> ___
> *Kalkulator sam nalicza recydywy oraz pokazuje odpowiednio zwiększoną karę grzywny i odsiadki.*

> **Formularz i akcje**
> [color=green]
> - Formularz
> *Pokazuje obywatela któremu wypisujemy kartotekę, oraz daje możliwość zmiany finalnej wartości grzywny oraz odsiadki jak i również zmiany autora wpisu (np. SWAT).*
> *Jeżeli obywatel był poszukiwany, pojawia się opcja `Dołącz list gończy` która doda do aktualnych wpisów te zapamiętane z listu.*
> - Akcje
>   - Informacyjne
>   *Pokazują tylko powiadomienie z możliwością skopiowania go*
>     - `Podsumowanie`
>     `[TARYFIKATOR] [GRZYWNA] | [ODSIADKA]`
>     - `Faktura`
>     `[TARYFIKATOR] [GRZYWNA] | [ODSIADKA] [AUTOR]`
>     - `Aresztowanie`
>     `[TARYFIKATOR] [AUTOR]`
>   - Funkcyjne
>     - `List gończy`
>     *Ustawia status obywatela jako **poszukiwany** wraz z wybranymi wpisami z taryfikatora (grzywna i odsiadka nie są zapamiętywane)*
>     - `Potwierdź`
>     *Tworzy wpis w kartotece obywatela oraz zamyka listy gończe, jeżeli jakieś były.*

## :sleuth_or_spy: Poszukiwani
![](https://i.imgur.com/A8Zjppj.png)

Lista wszystkich wystawionych listów gończych wraz przewidywaną karą za przewinienia.
Kliknięcie w list gończy przekieruje do [szczegółów obywatela](#Szczegóły-obywatela)

## :cop: Policjanci
![](https://i.imgur.com/2zhHSyK.png)

Lista rozwijana ze wszystkimi aktualnie zatrudnionymi policjantami.

> [color=red]
> - `Nr. odznaki`
> *Zmienia numer odznaki obywatela*
> - `Ranga`
> *Zmienia [rangę](##-Rangi) policjanta*
> - `Zwolnij`
> *Wyłącza konto policjanta*
> ***WAŻNE:** Po ponownym zatrudnieniu **nie** jest generowane nowy e-mail oraz hasło, dane logowania z pierwszego zatrudnienia wciąż są używane.*

## :page_facing_up: Taryfikator
![](https://i.imgur.com/LKC9IPi.png)

Lista możliwych do naliczenia na ekranie [aresztuj | faktura](#Aresztuj--Faktura) przestępst i wykroczeń.

#### Dostępne opcje

- Nazwa
- Grzywna (USD)
- Odsiadka (tygodnie)
- [Ikona](#-Ikony) - służy do kategoryzowania wpisów
- Recydywa - określa czy ma być naliczana recydywa za dany wpis

## :question: Ikony
![](https://i.imgur.com/mAjrHCQ.png)

Lista wszystkich możliwych do użycia ikon. Służą do kategoryzowania wpisów w [kartotece](#Szczegóły-obywatela) oraz na ekranie [aresztuj | faktura](#Aresztuj--Faktura)

#### Dostępne opcje

- Przeznaczenie - po najechaniu na ikonę, wyświetli się jej przeznaczenie
![](https://i.imgur.com/YRgc7A2.png)
- Grafika - w formacie ciągu znaków odpowiadającym emotce (identycznie jak na discord)
`:computer:` = :computer: 


## :lock: Rangi
![](https://i.imgur.com/fOaJRts.png)

Lista wszystkich dostępnych rang, które można przypisać policjantowi

#### Dostępne opcje:
- Nazwa
- Callsign
- Odznaka - URL grafiki zakończony jako `.jpg | .jpeg | .png | .gif`
- Permisje - dostęp do poszczególnych funkcji tabletu


# Poradniki:

## Kopiowanie zdjęcia (np. skan dowodu)

Kopiowanie zdjęcia w taki sposób aby był dostępny w tablecie rozumiane jest, poprzez przechowanie tzw. UrlData w schowku, lub po ludzku, skopiować dosłownie zdjęcie, a nie ścieżke do niego lub plik.

Możemy tego dokonać m. in. w podane niżej sposoby:

- `CTRL + Shift + S` - w Windows 10 wchodzi w tryb przechwytywania ekranu, gdzie możemy zaznaczyć sobie obszar kopiowania.

- Discord - po powiększeniu zdjęcia, klikamy `PPM` na podglądzie i wybieramy opcje `Kopiuj podgląd obrazu`
![](https://i.imgur.com/a2NnMdH.png)

- Narzędzie wycinanie - w Windows wszykujemy w Menu Start frazę `Narzędzie Wycinanie`. Uruchamiamy go, naciskamy `Nowy`, wybieramy
    - w Menu Start wyszukujemy program `Narzędzie Wycinanie` i uruchamiamy go
    - Naciskamy przycisk `Nowy`
    ![](https://i.imgur.com/Q0bofv1.png)
    - Zaznaczamy obszar koiowania
    - Naciskamy przycisk `Kopiuj`
    ![](https://i.imgur.com/f6E3Ws5.png)
