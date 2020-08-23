Najbardziej rozsądną opcją wydaje się model klient-serwer. To, czy aplikacja kliencka byłaby w wersji przeglądarkowej, czy desktopowej, nie powinno mieć dużego znaczenia. Administrator mógłby tworzyć lobby i podawać link / kod / hasło graczom i widzom co pozwalałoby na dołączenie do niego.

Aplikacja powinna posiadać trzy widoki:
1) Widzów
- stan licytacji – ilość pieniędzy każdej z drużyn, aktualna kwota użyta w licytacji, łączna pula pieniędzy, która bierze udział w licytacji
- kategoria w momencie licytacji, następnie pytanie, ewentualnie możliwe odpowiedzi jeśli pytanie jest typu abcd
- wyświetlenie podpowiedzi, jeśli zostanie wykupiona
- w przypadku pytania 1:1 lista kategorii, które eliminowaliby gracze aż pozostanie jedna z nich, następnie pytanie
- wylosowanie czarnej skrzynki (jakiś sposób poinformowania widzów)
- licznik czasu w trakcie odpowiedzi
- licznik czasu w trakcie licytacji (pozostały czas na decyzję po ostatniej kwocie)
2) Graczy
- wszystkie elementy dostępne dla widzów
- w przypadku gry 1:1 wybranie odpowiedniej opcji (eliminacja kategorii oraz wybór kategorii)
- klasycznie kwoty licytacji wpisywane były przez osobę obsługującą, jeśli w grę wchodzi forma online to warto zastanowić się nad możliwością licytacji przez graczy. Np. dodatkowe pola, gdzie gracze wpisują kwotę licytacji na tych zwykłych zasadach (kto wpisze wyższą kwotę, kto wpisze pierwszy taką samą kwotę)
- prośba o podpowiedź, miejsce na wpisanie kwoty za nią, akceptacja oferty od prowadzącego
3) Osoby obsługującej / administratora
- korekta stanu kont (do tej pory często zdarzały się błędy w licytacji)
- pominięcie pytania
- zresetowanie licytacji
- wydłużenie oraz zresetowanie czasu na odpowiedź
- wyświetlenie podpowiedzi, kwota za podpowiedź, akceptacja kwoty za podpowiedź
- zwiększenie puli licytacji
- importowanie pytań (kilka obsługiwanych formatów, były z tym problemy)

Teleturniej do tej pory przeprowadzany był w następujący sposób. Każda z drużyn otrzymywała laptopa z widokiem obserwującego bez możliwości interakcji. Ten sam widok wyświetlany był projektem na sali. Operator teleturnieju siedział pośród widzów i słuchając prowadzącego podbijał kwoty licytacji danej drużyny, wyświetlał pytania, resetował liczniki, eliminował kategorie itd. Niestety zdarzało się bardzo wiele błędów: niejasne licytacje, błędy drużyn w licytacji, problemy z cofaniem kwot (co nie było do końca możliwe) przez co konieczne było mówienie widzom, że wyświetlana kwota jest niepoprawna.
