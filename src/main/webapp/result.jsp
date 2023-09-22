<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="web.daos.PointDao" %>
<%@ page import="web.models.Point" %>

<!DOCTYPE html>
<html lang="ru-RU">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <meta name="author" content="Барсуков Максим Андреевич">
  <meta name="description" content="Веб-программирование: Лабораторная работа №2. Результаты проверки">
  <meta name="keywords" content="ITMO, ИТМО, ПИиКТ, ВТ, Лабораторная работа, Веб-программирование"/>

  <link href="stylesheets/styles.css" rel="stylesheet">
  <link rel="icon" type="image/jpg" href="images/favicon.jpg">
  <title>Результаты проверки | Веб-программирование</title>
</head>

<body>
<header class="shaded animated">
  <h1>Веб-программирование, Лабораторная работа №2, Вариант 9998</h1>
  <div id="credit">
    <a href="https://github.com/maxbarsukov" class="illuminated animated" title="Перейти к GitHub профилю">
      Барсуков Максим Андреевич, P3215
    </a>
  </div>
</header>

<table id="mainTable" class="shaded">
  <thead>
  <td colspan="5">
    <h3>Результаты проверки:</h3>
  </td>
  </thead>

  <tbody>
  <tr>
    <td colspan="5"><hr></td>
  </tr>
  </tbody>

  <tfoot>
  <tr>
    <td colspan="5" id="outputContainer">
      <% PointDao dao = (PointDao) request.getSession().getAttribute("bean");
        if (dao == null) {
      %>
      <h4>
        <span id="notifications" class="outputStub notification">Нет результатов</span>
      </h4>
      <table id="outputTable">
        <tr>
          <th>X</th>
          <th>Y</th>
          <th>R</th>
          <th>Точка входит в ОДЗ</th>
        </tr>
      </table>
      <% } else { %>
      <table id='outputTable'>
        <tr>
          <th>X</th>
          <th>Y</th>
          <th>R</th>
          <th>Точка входит в ОДЗ</th>
        </tr>
        <% for (Point point : dao.getPoints()) { %>
        <tr>
          <td>
            <%= point.getX() %>
          </td>
          <td>
            <%= point.getY() %>
          </td>
          <td>
            <%= point.getR() %>
          </td>
          <td>
            <%= point.isInArea() ? "<span class=\"success\">Попал</span>"
              : "<span class=\"fail\">Промазал</span>" %>
          </td>
        </tr>
        <% } %>
      </table>
      <% } %>
    </td>
  </tr>
  <tr>
    <td>
      <div id="goBack">
        <a href="index.jsp">Вернуться к форме</a>
      </div>
    </td>
  </tr>
  </tfoot>

</table>

<footer class="shaded animated">
  <figure>
    <a href="https://se.ifmo.ru">
      <img class="illuminated" src="images/logo.png"
           alt="Факультет Программной инженерии и компьютерной техники Университета ИТМО"
           title="Перейти на сайт ПИиКТ ИТМО">
    </a>
    <figcaption>2023</figcaption>
  </figure>
</footer>

<script src="script.js"></script>
</body>

</html>
