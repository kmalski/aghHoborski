Najbardziej rozsądną opcją wydaje się model klient-serwer. To, czy aplikacja kliencka byłaby w wersji przeglądarkowej, czy desktopowej, nie powinno mieć dużego znaczenia. Administrator mógłby tworzyć lobby i podawać link / kod / hasło graczom i widzom co pozwalałoby na dołączenie do niego.

Aplikacja powinna posiadać trzy widoki:
1) Widzów
- stan licytacji – ilość pieniędzy każdej z drużyn, aktualna kwota użyta w licytacji, łączna pula pieniędzy, która bierze udział w licytacji
- kategoria w momencie licytacji, następnie pytanie, ewentualnie możliwe odpowiedzi jeśli pytanie jest typu abcd
- wyświetlenie podpowiedzi, jeśli zostanie wykupiona
- w przypadku pytania 1:1 lista kategorii, które eliminowaliby gracze aż pozostanie jedna z nich, następnie pytanie
- wylosowanie czarnej skrzynki (jakiś sposób poinformowania widzów)
- licznik czasu w trakcie odpowiedzi
2) Graczy
- na początek identyczny do ekranu widza
3) Prowadzącego
- taki jak widza z pokazanymi podpowiedziami i odpowiedzią
4) Osoby obsługującej / administratora
- korekta stanu kont (do tej pory często zdarzały się błędy w licytacji)
- pominięcie pytania
- zresetowanie licytacji
- wydłużenie oraz zresetowanie czasu na odpowiedź
- wyświetlenie podpowiedzi, kwota za podpowiedź, akceptacja kwoty za podpowiedź
- zwiększenie puli licytacji
- importowanie pytań (kilka obsługiwanych formatów lub edycja pytań, były z tym problemy)
- dodanie bazy danych i możliwość odtworzenia stanu niezakończonej gry

Teleturniej do tej pory przeprowadzany był w następujący sposób. Każda z drużyn otrzymywała laptopa z widokiem obserwującego bez możliwości interakcji. Ten sam widok wyświetlany był projektem na sali. Operator teleturnieju siedział pośród widzów i słuchając prowadzącego podbijał kwoty licytacji danej drużyny, wyświetlał pytania, resetował liczniki, eliminował kategorie itd. Niestety zdarzało się bardzo wiele błędów: niejasne licytacje, błędy drużyn w licytacji, problemy z cofaniem kwot (co nie było do końca możliwe) przez co konieczne było mówienie widzom, że wyświetlana kwota jest niepoprawna.

Opcjonalnie do zrobienia w przyszłości lub gdy wystarczy czasu:
- podbicie wersji Vue do Vue 3 (w zależności czy użyte biblioteki rozpoczną wsparcie dla najnowszej wersji)
- dostosowanie do wersji mobilnej przeglądarki
- dodanie opcji licytacji przez graczy, co za tym idzie dodatkowe pola, możliwość wpisywania kwot, wybór odpowiedzi, eliminacja kategorii w grze 1:1, obsługa podpowiedzi
- obsługa pytań z obrazkami